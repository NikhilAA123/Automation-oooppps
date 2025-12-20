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

## 📁 Project Structure

- `frontend/src/nodes/`: Custom node logic and styling.
- `frontend/src/assets/`: Iconography and visual assets.
- `frontend/src/store.js`: Zustand store with history tracking.
- `backend/main.py`: FastAPI endpoints and DAG algorithm.

---

**Problem Statement Reference**: This project fulfills the technical assessment for building a modular, abstract, and functional pipeline UI with a backend DAG check.
