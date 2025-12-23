## Med LLaVA Inference Server

This folder turns the original notebook into a production-ready GPU inference service that you can ship to any rented GPU box (RunPod, Lambda, Vast, etc.). It keeps the original RAG + MedCPT retrieval pipeline, adds LangChain conversation memory, and wraps everything behind a FastAPI endpoint with a self-correction stage to cut hallucinations.

### Highlights

- **Model Hosting**: Loads your `MidWin/Medfinetune` (or any LLaVA-Med derivative) directly from Hugging Face via vLLM for high-throughput GPU serving.
- **Conversation Memory**: LangChain `ConversationSummaryBufferMemory` keeps multi-turn medical interviews coherent.
- **RAG over PubMed**: MedCPT query encoder + FAISS index pulled from Hugging Face Hub (no more Google Drive mounts).
- **Self-Correction**: Two-stage prompting (Draft → Supervisor) to verify every answer before returning it to the user.
- **Safety Guardrails**: Emergency & sensitive-topic warnings, post-processing, and source-aware prompts.

### Folder Layout

```
inference_server/
├── README.md
├── requirements.txt
├── env.sample
├── Dockerfile
└── src/
    ├── api.py                # FastAPI app (health + /v1/chat/completions)
    ├── config.py             # Pydantic settings + env bindings
    ├── memory.py             # LangChain session memory manager
    ├── model_loader.py       # vLLM engine + LangChain adapter + sampler
    ├── pipeline.py           # Orchestration (prompting, RAG, self-correction)
    ├── prompts.py            # Vietnamese system prompts
    ├── retriever.py          # PubMed loader, MedCPT encoder, FAISS search
    └── utils.py              # Safety guard, cleaning helpers
```

### Prepare Hugging Face Assets

1. **Model**: Push your merged LLaVA-Med weights to `MidWin/Medfinetune` (or update `MODEL_ID` in `.env`).
2. **RAG artifacts**: Zip the dataset folder you saved via `pubmed_ds.save_to_disk()`:

   ```bash
   tar -czf pubmed_ds_embedded.tar.gz pubmed_ds_embedded
   ```

   Upload `pubmed_ds_embedded.tar.gz` **and** `faiss_index.bin` to a Hugging Face *dataset* repo (e.g. `MidWin/pubmed-medcpt-faiss`).  
   Update `RAG_REPO_ID`, `RAG_DATASET_ARCHIVE`, `RAG_DATASET_DIRNAME`, and `RAG_INDEX_FILE` if you change the names.

### Local / GPU Setup

```bash
cd inference_server
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install --upgrade pip
pip install -r requirements.txt
cp env.sample .env  # fill in HF token + knobs
python -m src.api  # runs uvicorn with hot-reload disabled
```

Environment variables (see `env.sample`):

- `HF_TOKEN`: Personal token with `read` access to pull private weights.
- `MODEL_ID`: Hugging Face model repo (LLaVA-Med checkpoint).
- `RAG_*`: Dataset/index repo + filenames.
- `GPU_MEMORY_UTILIZATION`, `MAX_NEW_TOKENS`, etc. for inference tuning.

### Run on a Rented GPU

1. Provision a GPU pod with at least 24 GB VRAM (A10G, L40S, A100 recommended).
2. Clone this repo onto the instance and copy `.env`.
3. Build & run the container (requires NVIDIA Container Toolkit):

   ```bash
   docker build -t med-llava-server ./inference_server
   docker run --gpus all --env-file .env -p 8080:8080 med-llava-server
   ```

   The server exposes:
   - `GET /health`: readiness + model info.
   - `POST /v1/chat/completions`: JSON body `{question, session_id?, max_new_tokens?, top_k?}`.

4. Mount persistent storage (RunPod `storage` or external volume) at `/workspace/.cache` if you want the downloaded model/RAG assets to survive pod restarts.

### LangChain Memory & Self-Correction Flow

1. **Memory**: Each `session_id` gets a `ConversationSummaryBufferMemory`. LangChain summarizes history using the same vLLM instance to stay within context limits.
2. **RAG**: Every question is vectorized via `ncbi/MedCPT-Query-Encoder`, searched against FAISS, filtered by score/keywords, then truncated to `MAX_CONTEXT_CHARS`.
3. **Draft**: Base prompt (`prompts.BASE_PROMPT`) injects history + filtered context and generates an answer with confidence scoring.
4. **Verify**: `SELF_CORRECTION_PROMPT` forces the model to act as a supervisor, returning JSON `{verdict, final_answer, citations}`. If parsing fails, the pipeline falls back to the draft.
5. **Safety + Cleanup**: Emergency warnings are prepended, hallucination-prone artifacts stripped, and citations kept.

### Integrating With Your Frontend

```
POST https://<gpu-host>:8080/v1/chat/completions
{
  "question": "Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?",
  "session_id": "patient-123",
  "max_new_tokens": 512,
  "top_k": 5
}
```

Response:

```json
{
  "answer": "⚠️ ...",
  "draft": "...",
  "confidence": 0.78,
  "verdict": "pass",
  "citations": ["[1]", "[2]"],
  "context_docs": [
    {"title": "...", "pmid": "...", "score": 0.57}
  ]
}
```

Use `session_id` to tie conversations to LangChain memory (e.g., per patient visit).  
If you need streaming, wrap `pipeline.ask` inside a FastAPI `StreamingResponse` and chunk tokens emitted by `vLLM` (supported via `engine.generate_greedy`).

### Next Steps

- Add auth (API keys/JWT) before exposing publicly.
- Plug in observability (Prometheus counters for latency, queue depth, GPU memory).
- Create a nightly job to refresh the FAISS index if you keep expanding the PubMed subset.
- Consider LangGraph for more advanced multi-step diagnostic workflows if you need specialist routing later.

