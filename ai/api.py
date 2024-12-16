import requests
import fitz  # PyMuPDF
from io import BytesIO
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import torch

app = FastAPI()

modelo = SentenceTransformer('all-MiniLM-L6-v2')

data_store = {
    "textos": [],
    "archivos": [],
    "embeddings": None
}

class Consulta(BaseModel):
    query: str
    top_k: int = 5

def extraer_texto_pdf(url: str) -> str:
    """Extrae el contenido del PDF desde una URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()

        pdf_data = response.content

        documento_pdf = fitz.open(stream=pdf_data, filetype="pdf")

        texto_completo = ""
        for pagina in documento_pdf:
            texto_completo += pagina.get_text()

        return texto_completo
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar el PDF: {e}")

@app.post("/load-pdfs/")
def cargar_pdfs(api_url: str):
    """Consume una API externa para obtener textos de documentos PDF."""
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        
        documentos = response.json()
        
        textos = []
        archivos = []
        
        for doc in documentos:
            contenido_pdf = extraer_texto_pdf(doc['documento_url'])
            
            textos.append(contenido_pdf)
            archivos.append({
                "nombre": doc['nombre'],
                "url": doc['documento_url']
            })
        
        if not textos:
            raise HTTPException(status_code=400, detail="No se encontraron documentos en la API proporcionada.")

        embeddings = modelo.encode(textos, convert_to_tensor=True)
        
        data_store["textos"] = textos
        data_store["archivos"] = archivos
        data_store["embeddings"] = embeddings

        return {"mensaje": f"Se cargaron {len(archivos)} documentos.", "archivos": archivos}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error al consumir la API: {e}")

@app.post("/search/")
def buscar_semanticamente(consulta: Consulta):
    """Realiza una búsqueda semántica entre los documentos cargados."""
    if data_store["embeddings"] is None or data_store["embeddings"].size(0) == 0:
        raise HTTPException(status_code=400, detail="Primero cargue los documentos desde la API.")

    query_embedding = modelo.encode(consulta.query, convert_to_tensor=True)
    similitudes = util.cos_sim(query_embedding, data_store["embeddings"])[0]

    top_k = min(consulta.top_k, len(data_store["textos"]))
    if top_k == 0:
        return []

    resultados = torch.topk(similitudes, k=top_k)

    resultados_lista = []
    for idx in resultados.indices:
        resultados_lista.append({
            "archivo": data_store["archivos"][idx]["nombre"],
            "url": data_store["archivos"][idx]["url"],
            "fragmento": data_store["textos"][idx][:300],
            "similitud": similitudes[idx].item()
        })

    return {"resultados": resultados_lista}
