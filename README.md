# FlowForge AI — Distributed AI Workflow Orchestration Engine

**FlowForge AI** is a backend-focused AI workflow orchestration platform that allows developers and users to define, manage, and execute complex, multi-step AI pipelines as Directed Acyclic Graphs (DAGs) of connected nodes.

---

## Overview & Problem Statement

Modern AI applications are shifting from single LLM calls to complex, multi-step workflows. A production-ready AI workflow typically ingests unstructured documents, chunks and embeds data, queries vector databases, calls various LLMs, and interfaces with external REST APIs.

Building these pipelines procedurally inside application code presents major operational challenges:
* **Tight Coupling:** Workflow logic becomes buried inside core backend code, requiring code updates for any workflow change.
* **Synchronous Bottlenecks:** Long-running AI operations and API calls block HTTP requests and overload app servers.
* **Lack of Resilience:** Node failures crash the whole process without built-in retry mechanisms or state tracking.
* **Observability Deficit:** Measuring per-node execution latencies, cost, or failures is difficult without dedicated tracing.
* **Redundant Operations:** Repeated LLM prompts or vector embeddings waste API budgets and increase latency.

### The FlowForge AI Solution

FlowForge AI decouples workflow definition from execution logic. It provides a visual and API-driven execution engine that interprets graph schemas, schedules node execution based on dependency DAGs, dispatches tasks asynchronously to background worker processes, and caches intermediate steps.

---

## Key Features

* **Visual & API Workflow Definition:** Define workflows visually using React Flow or via RESTful JSON schemas.
* **DAG Execution Engine:** Interprets workflow graphs, validates cycle-free dependency structures, and executes nodes concurrently where possible.
* **Asynchronous & Scalable Workers:** Decouples API processing from heavy execution using Redis task queues and scalable worker processes.
* **AI & RAG Node Ecosystem:**
  * **Input & Output Nodes**
  * **Document Loader & Text Splitter Nodes**
  * **Embedding & Vector Search Retriever Nodes**
  * **LLM & Prompt Template Nodes**
  * **HTTP/API Request & Conditional Router Nodes**
* **Resilience & State Persistence:** Real-time state recording per node, failure handling, and automatic retries with exponential backoff.
* **Redis Caching Layer:** Caches expensive deterministic vector operations and LLM embeddings to optimize latency and token usage.
* **Comprehensive Observability:** Track execution metrics, queue wait times, and per-node performance via Prometheus and Grafana.

---

## System Architecture

```text
               +----------------------------------+
               |      React / Next.js UI          |
               |    (Visual Workflow Builder)     |
               +----------------+-----------------+
                                |
                                v
               +----------------+-----------------+
               |       FastAPI Backend API        |
               +-------+----------------+---------+
                       |                |
             Persists  |                | Dispatches
           Definitions |                | Execution Jobs
                       v                v
            +----------+-----+   +------+----------+
            |  MongoDB DB    |   |   Redis Queue   |
            +----------------+   +------+----------+
                                        |
                                        v
                                 +------+----------+
                                 | Async Workers   |
                                 +---+---+---+-----+
                                     |   |   |
                  +------------------+   |   +-------------------+
                  v                      v                       v
          +---------------+      +---------------+      +----------------+
          | LLM Providers |      | Vector DB     |      | Redis Cache    |
          | (OpenAI, etc) |      | (Embeddings)  |      | (Hits/Misses)  |
          +---------------+      +---------------+      +----------------+
```

---

## Repository Structure

```text
FlowForge-AI/
├── backend/                  # FastAPI Application Service
│   ├── app/
│   │   ├── api/              # API Endpoints (Workflows, Runs, Nodes)
│   │   ├── core/             # Configuration, DB & Redis Clients
│   │   ├── models/           # Pydantic Schemas & MongoDB Models
│   │   ├── repositories/     # Data Access Layer
│   │   ├── services/         # Workflow & Execution Engine Logic
│   │   └── workers/          # Background Task & Queue Processors
│   ├── tests/                # Unit and Integration Tests
│   └── main.py               # Application Entrypoint
├── frontend/                 # React UI (Vite + React Flow)
│   ├── src/                  # Components, Hooks, Canvas
│   ├── public/               # Static Assets
│   └── vite.config.js
├── queue/                    # Redis Worker & Task Queue Configurations
├── docker-compose.yml        # Multi-container local deployment
└── README.md
```

---

## Example RAG Workflow Pipeline

FlowForge AI manages workflow graphs such as a Retrieval-Augmented Generation (RAG) pipeline:

```text
+-------------------+
|  Document Upload  |
+---------+---------+
          |
          v
+---------+---------+
|  Document Parser  |
+---------+---------+
          |
          v
+---------+---------+
|   Text Chunker    |
+---------+---------+
          |
          v
+---------+---------+
| Embedding Engine  |
+---------+---------+
          |
          v
+---------+---------+
|  Vector Database  |
+---------+---------+
          |
          | (Context Retrieval)
          v
+---------+---------+      +-------------------+
|  Retriever Node   | <--- |   User Question   |
+---------+---------+      +-------------------+
          |
          v
+---------+---------+
|     LLM Node      |
+---------+---------+
          |
          v
+---------+---------+
|  Response Output  |
+-------------------+
```

---

## Tech Stack

* **Backend:** Python 3.11+, FastAPI, Pydantic, AsyncIO
* **Frontend:** React, Vite, React Flow
* **Databases:** MongoDB (Workflow & Execution metadata), Qdrant/Chroma (Vector DB)
* **Queue & Caching:** Redis, Redis Queue (RQ) / Celery
* **Observability:** Prometheus, Grafana
* **DevOps & Testing:** Docker, Docker Compose, Pytest, GitHub Actions CI

---

## Implementation Roadmap

- [x] **Phase 1: Project Foundation** — Monorepo setup, FastAPI, MongoDB, Redis, Docker configuration.
- [ ] **Phase 2: Workflow CRUD & Graph Validation** — Schemas, DAG validation, cycle detection.
- [ ] **Phase 3: Execution Engine Core** — Graph traversal, dependency tracking, state recording.
- [ ] **Phase 4: Async Workers & Queues** — Redis job queueing, worker pool execution, exponential backoff retries.
- [ ] **Phase 5: AI & LLM Nodes** — LLM provider abstraction, prompt templates, token tracking.
- [ ] **Phase 6: RAG Infrastructure** — Document ingestion, chunking, embeddings, vector similarity search.
- [ ] **Phase 7: Parallel Execution Engine** — Concurrent node execution for independent DAG branches.
- [ ] **Phase 8: Redis Caching Layer** — TTL caching for embeddings and deterministic queries.
- [ ] **Phase 9: Observability & Metrics** — Prometheus metrics, Grafana dashboards, node latency tracking.
- [ ] **Phase 10: Performance Benchmarking** — High-concurrency throughput testing and latency profiling.
- [ ] **Phase 11: Visual Workflow Builder UI** — Interactive canvas with React Flow node drag-and-drop.
- [ ] **Phase 12: Production Hardening** — Authentication, rate limiting, graceful worker shutdowns.
- [ ] **Phase 13: Technical Documentation & Benchmarks** — Architecture decision records and performance logs.

---

## Quickstart & Local Setup

### Prerequisites
* **Python** 3.11+
* **Node.js** 18+
* **Docker & Docker Compose** (for running MongoDB, Redis, and Vector DB)

### Running Local Infrastructure
```bash
docker-compose up -d
```

### Running Backend API
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Running Frontend Application
```bash
cd frontend
npm install
npm run dev
```

---

## License

This project is licensed under the [MIT License](LICENSE).
