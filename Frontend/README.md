# 🎨 AutoNoCode Frontend

This is the React-based frontend for the AutoNoCode Pipeline Builder. It is built using **React Flow** for the canvas and **Zustand** for state management.

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development
Run the development server with local proxy to the backend:
```bash
npm start
```
_The app will be available at `http://localhost:3000`. API calls are proxied to `http://localhost:8000` via `package.json` configurations._

### 3. Production Build
```bash
npm run build
```

## 🏗️ Architecture

### Node System
All nodes inherit from a `BaseNode` component, which handles:
- Consistent header styling and icons.
- Deletion logic and confirmation dialogs.
- Minimize/Maximize functionality.

### State Management (Zustand)
We use Zustand to manage:
- Node and edge state.
- **Undo/Redo** functionality (History tracking).
- Global actions like `clearCanvas` and `addNode`.

### API Integration
Communication with the FastAPI backend is handled using **relative paths** (e.g., `/pipelines/parse`). This allows the same frontend build to work across different environments (local dev, EKS, etc.) without code changes.

## 🛠️ Key Technologies
- **React Flow**: Highly customizable library for building node-based editors.
- **Zustand**: Fast and scalable state management.
- **Vanilla CSS**: Clean and modular styling.
