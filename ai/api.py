import requests
import fitz  # PyMuPDF
from io import BytesIO
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import torch
from dotenv import load_dotenv
import time
import os

load_dotenv()

app = FastAPI()

SENTENCE_TRANSFORMER = os.getenv('SENTENCE_TRANSFORMER')

modelo = SentenceTransformer(SENTENCE_TRANSFORMER)

data_store = {
    "texts": [],
    "files": [],
    "embeddings": None
}

class Query(BaseModel):
    query: str
    top_k: int = 5

def extract_text_pdf(url: str) -> str:
    """
    Extracts text from a PDF file located at the given URL.

    This function downloads the PDF file from the specified URL, extracts the text from each page,
    and concatenates it into a single string.

    Args:
        url (str): The URL of the PDF file to be processed.

    Returns:
        str: The extracted text from the PDF file.

    Raises:
        HTTPException: If there is an error processing the PDF file.
    """
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

def load_pdfs(api_url: str):
    """
    Fetches PDF documents from the provided API URL, extracts text from each PDF, 
    and encodes the text into embeddings.
    Args:
        api_url (str): The URL of the API to fetch PDF documents from.
    Raises:
        HTTPException: If no documents are found in the API response or if there is an error consuming the API.
    Returns:
        None: The function updates the global data_store with the extracted texts, file information, and embeddings.
    """
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        
        documents = response.json()
        
        texts = []
        files = []
        
        for doc in documents:
            pdf_content = extract_text_pdf(doc['documento_url'])
            
            texts.append(pdf_content)
            files.append({
                "filename": doc['nombre'],
                "url": doc['documento_url'],
                "description": doc['descripcion'],
                "year": doc['anio'],
                "container": {
                    "type": doc['Contenedor']['Tipo_Contenedor']['nombre'], 
                    "shelf_name": doc['Contenedor']['Estante']['nombre_estante'],
                    "anio": doc['Contenedor']['anio'],
                    "name": doc['Contenedor']['nombre'],
                    "description": doc['Contenedor']['descripcion'],
                    "row": doc['Contenedor']['fila'],
                    "column": doc['Contenedor']['columna']
                },
                "categoria_name": doc['Categoria_Documento']['nombre_categoria']
            })
        
        if not texts:
            raise HTTPException(status_code=400, detail="No se encontraron documentos en la API proporcionada.")

        embeddings = modelo.encode(texts, convert_to_tensor=True)
        
        data_store["texts"] = texts
        data_store["files"] = files
        data_store["embeddings"] = embeddings
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error al consumir la API: {e}")

@app.post("/supersearch/")
def supersearch(query: Query):
    """
    Handles the /supersearch/ endpoint for performing a search query on pre-loaded documents.

    Args:
        query (Query): The search query containing the text to search for and the number of top results to return.

    Raises:
        HTTPException: If the document embeddings are not loaded or empty.

    Returns:
        dict: A dictionary containing the search query, results, and metadata.
            - query (str): The original search query.
            - results (dict): The search results.
                - count (int): The number of results returned.
                - top_k (int): The number of top results requested.
                - items (list): A list of dictionaries containing the search results.
                    - filename (str): The name of the file.
                    - url (str): The URL of the file.
                    - fragment (str): A fragment of the text from the file.
                    - similarity (float): The similarity score of the result.
            - metadata (dict): Metadata about the search.
                - search_duration (float): The duration of the search in seconds.
                - search_duration_unit (str): The unit of the search duration.
                - timestamp (str): The timestamp of the search in UTC.
    """
    DOCS_ENDPOINT = os.getenv('DOCS_ENDPOINT')

    load_pdfs(DOCS_ENDPOINT)

    if data_store["embeddings"] is None or data_store["embeddings"].size(0) == 0:
        raise HTTPException(status_code=400, detail="Primero cargue los documentos desde la API.")

    start_time = time.time()

    query_embedding = modelo.encode(query.query, convert_to_tensor=True)
    similitudes = util.cos_sim(query_embedding, data_store["embeddings"])[0]

    top_k = min(query.top_k, len(data_store["texts"]))
    if top_k == 0:
        return []

    results = torch.topk(similitudes, k=top_k)

    payload_list = []
    for idx in results.indices:

        compose_summary_ESP = (
            f"El documento '{data_store['files'][idx]['filename']}' del {data_store['files'][idx]['year']} "
            f"se encuentra en {data_store['files'][idx]['container']['type'].lower()} "
            f"'{data_store['files'][idx]['container']['name']}' "
            f"({data_store['files'][idx]['container']['description']}). "
            f"Está ubicado en el estante {data_store['files'][idx]['container']['shelf_name']}, "
            f"en la fila {data_store['files'][idx]['container']['row']} "
            f"columna {data_store['files'][idx]['container']['column']}. "
            f"Pertenece a la categoría de {data_store['files'][idx]['categoria_name']}"
        )

        payload_list.append({
            "filename": data_store["files"][idx]["filename"],
            "url": data_store["files"][idx]["url"],
            "fragment": data_store["texts"][idx][:300],
            "similarity": similitudes[idx].item(),
            "summary_ESP": compose_summary_ESP,
        })

    end_time = time.time()
    search_duration = end_time - start_time

    return {
        "query": query.query,
        "results": {
            "count": len(payload_list),
            "top_k": query.top_k,
            "items": payload_list
        },
        "metadata": {
            "search_duration": search_duration,
            "search_duration_unit": "seconds",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime()),
            "total_documents": len(data_store["texts"])
        }
    }
