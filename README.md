# AutoNoCode Pipeline Builder

A powerful, interactive, and visually stunning pipeline builder. Built with React Flow and FastAPI, this application allows users to construct complex logic flows with specialized nodes, real-time feedback, and backend validation.

## 🚀 Features

### ✨ Frontend (React)

- **Unified Node Architecture**: All nodes use a shared `BaseNode` design for consistency but support specialized logic.
- **9 Specialized Nodes**:
  - **Input / Output**: Standard entry and exit points.
  - **LLM Engine**: Integration for language model processing (OpenAI inspired).
  - **Text / Template**: Supports dynamic handles using `{{variable}}` syntax.
  - **API / Filter / Math / Delay / Condition**: Advanced nodes for logic and data processing.
- **Premium Toolbar**:
  - Expandable node menu with fuzzy search.
  - "Queue" positioning: Nodes added via the menu are automatically staggered to prevent overlap.
- **Undo / Redo**: Full history support for node deletion, movement, and connections.
- **Interactive Connections**: Custom edges with integrated "X" delete buttons and mismatch validation (red color).
- **Auto-Saving Indicators**: Real-time pulsing "Saving..." state and "Last saved" timestamps.
- **Clean Workspace**: A rounded-corner contained canvas for better focus.

### ⚙️ Backend (FastAPI)

- **DAG Validation**: Checks if the constructed pipeline forms a Directed Acyclic Graph using Kahn's algorithm.
- **Pipeline Parser**: Analyzes node and edge counts sent from the frontend.
- **CORS Enabled**: Ready for local development and communication.

## 🛠️ Tech Stack

- **Frontend**: React, React Flow, Zustand (State Management), Vanilla CSS.
- **Backend**: Python, FastAPI, Pydantic.
- **Icons**: Custom SVG/PNG assets for all node types.

## 🏃 How to Run the Project

### 1. Prerequisites

- Node.js (v16+)
- Python (v3.9+)

### 2. Backend Setup

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

_Backend will run on `http://localhost:8000`_

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

_Frontend will run on `http://localhost:3000`_

## 🏢 Architecture & Deployment

### Infrastructure (AWS EKS)

The application is deployed on an **AWS EKS Cluster** using a modern, scalable architecture:

- **Ingress Controller**: [NGINX Ingress](https://kubernetes.github.io/ingress-nginx/) manages external traffic.
- **SSL/TLS**: [Cert-Manager](https://cert-manager.io/) automatically issues Let's Encrypt certificates.
- **DNS**: Uses `nip.io` for dynamic IP-based hostnames (e.g., `34.197.168.162.nip.io`).
- **Container Registry**: Images are stored in **Amazon ECR**.

### CI/CD Workflow

1.  **Build**: Docker images are built for both `frontend/` and `backend/`.
2.  **Tag & Push**: Images are tagged as `latest` and pushed to project-specific ECR repositories.
3.  **Deploy**: Kubernetes manifests in `k8s/` are applied to the cluster.
4.  **Rollout**: `kubectl rollout restart` ensures the cluster pulls the latest images from ECR.

## 📁 Project Structure

- `frontend/`: React application using React Flow and Zustand.
- `backend/`: FastAPI server for DAG validation and pipeline parsing.
- `k8s/`: Kubernetes manifests (Deployment, Service, Ingress, ClusterIssuer).

---

**Built with ❤️ for the VectorShift Technical Assessment.**
