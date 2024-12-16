import os
import streamlit as st
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer, util
import torch

def cargar_pdfs(directorio):
    """Carga todos los PDFs en un directorio y extrae su texto."""
    textos = []
    archivos = []
    for archivo in os.listdir(directorio):
        if archivo.endswith('.pdf'):
            ruta = os.path.join(directorio, archivo)
            lector = PdfReader(ruta)
            texto = ''
            for pagina in lector.pages:
                texto += pagina.extract_text()
            textos.append(texto)
            archivos.append(archivo)
    return textos, archivos

def crear_embeddings(textos, modelo):
    """Crea embeddings para una lista de textos usando un modelo."""
    return modelo.encode(textos, convert_to_tensor=True)

# Paso 3: Realizar la búsqueda semántica
def buscar_semanticamente(query, embeddings, textos, modelo, archivos, top_k=5):
    """Busca entre los textos usando embeddings semánticos."""
    query_embedding = modelo.encode(query, convert_to_tensor=True)
    similitudes = util.cos_sim(query_embedding, embeddings)[0]

    top_k = min(top_k, len(textos))
    if top_k == 0:
        return []

    resultados = torch.topk(similitudes, k=top_k)

    resultados_lista = []
    for idx in resultados.indices:
        resultados_lista.append({
            "archivo": archivos[idx],
            "fragmento": textos[idx][:300],
            "similitud": similitudes[idx].item()
        })
    return resultados_lista

st.set_page_config(layout="wide")
st.title("Búsqueda Semántica en PDFs")

if "archivos" not in st.session_state:
    st.session_state.archivos = []
    st.session_state.textos = []
    st.session_state.embeddings = None

col1, col2 = st.columns([2, 1])

directorio = col2.text_input("Directorio de PDFs", "./pdfs")
modelo = SentenceTransformer('all-MiniLM-L6-v2')

if col2.button("Cargar PDFs"):
    with st.spinner("Cargando y procesando PDFs..."):
        textos, archivos = cargar_pdfs(directorio)
        if len(archivos) > 0:
            embeddings = crear_embeddings(textos, modelo)
            st.session_state.archivos = archivos
            st.session_state.textos = textos
            st.session_state.embeddings = embeddings
            col2.success(f"Se cargaron {len(archivos)} archivos PDF.")
        else:
            col2.warning("No se encontraron archivos PDF en el directorio.")

if len(st.session_state.archivos) > 0:
    col2.subheader("Archivos cargados")
    col2.table({"Archivo": st.session_state.archivos})

query = col1.text_input("Ingrese su consulta:")

if col1.button("Buscar"):
    if st.session_state.embeddings is not None:
        with st.spinner("Buscando..."):
            resultados = buscar_semanticamente(query, st.session_state.embeddings, st.session_state.textos, modelo, st.session_state.archivos)
        if resultados:
            col1.subheader("Resultados de la búsqueda:")
            for resultado in resultados:
                col1.write(f"**Archivo:** {resultado['archivo']}")
                col1.write(f"**Fragmento:** {resultado['fragmento']}...")
                col1.write(f"**Similitud:** {resultado['similitud']:.4f}")
                col1.write("---")
        else:
            col1.warning("No se encontraron resultados.")
    else:
        col1.error("Primero cargue los PDFs haciendo clic en el botón 'Cargar PDFs'.")
