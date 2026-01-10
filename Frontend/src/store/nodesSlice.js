// src/store/nodesSlice.js
// -----------------------------------------------------------------------------
// Redux slice responsible for managing pipeline nodes and edges
// Acts as the single source of truth for graph structure and node configuration
// -----------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

const initialState = {
  nodes: [],
  edges: [],
  nodeIDs: {},
  pipelineName: "Untitled Pipeline",

  // History
  past: [],
  future: [],
};

const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    // -------------------------------------------------------------------------
    // Node & Edge Changes (React Flow wrappers)
    // -------------------------------------------------------------------------
    onNodesChange: (state, action) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },

    onEdgesChange: (state, action) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },

    // -------------------------------------------------------------------------
    // Add Node
    // -------------------------------------------------------------------------
    addNode: (state, action) => {
      // Save history first (simplified: usually middleware handles this, but keeping it simple)
      state.past.push({ nodes: state.nodes, edges: state.edges });
      state.future = []; // Clear redo

      const node = action.payload;
      state.nodes.push(node);
    },

    // -------------------------------------------------------------------------
    // Remove Node
    // -------------------------------------------------------------------------
    removeNode: (state, action) => {
      state.past.push({ nodes: state.nodes, edges: state.edges });
      state.future = [];

      const nodeId = action.payload;
      state.nodes = state.nodes.filter((node) => node.id !== nodeId);
      state.edges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
    },

    // -------------------------------------------------------------------------
    // Update Node Field
    // -------------------------------------------------------------------------
    updateNodeField: (state, action) => {
      const { id, field, value } = action.payload;
      const node = state.nodes.find((n) => n.id === id);
      if (node) {
        node.data = { ...node.data, [field]: value };
      }
    },

    // -------------------------------------------------------------------------
    // Connections (addEdge)
    // -------------------------------------------------------------------------
    onConnect: (state, action) => {
      state.past.push({ nodes: state.nodes, edges: state.edges });
      state.future = [];

      const connection = action.payload;
      const { source, target } = connection;

      // Find nodes for type checking
      // Note: In Redux reducer, accessing state directly is fine since it's synchronous
      // However, we need to be careful with proxies. state.nodes is a proxy.
      const sourceNode = state.nodes.find((node) => node.id === source);
      const targetNode = state.nodes.find((node) => node.id === target);

      const sourceType = sourceNode?.data?.inputType || sourceNode?.data?.outputType || 'Text';
      const targetType = targetNode?.data?.inputType || targetNode?.data?.outputType || 'Text';
      const isTypeMismatch = sourceType !== targetType;

      const edgeOptions = isTypeMismatch
        ? {
          type: 'custom',
          label: "Data Types don't match",
          style: { stroke: "red" },
          labelStyle: { fill: "red", fontWeight: 700 },
          markerEnd: { type: MarkerType.Arrow, color: "red" },
        }
        : {
          type: 'custom',
          animated: true,
          markerEnd: { type: MarkerType.Arrow, height: "20px", width: "20px" },
        };

      state.edges = addEdge({ ...connection, ...edgeOptions }, state.edges);
    },

    // -------------------------------------------------------------------------
    // Metadata
    // -------------------------------------------------------------------------
    setPipelineName: (state, action) => {
      state.pipelineName = action.payload;
    },

    // Helper to get ID is distinct from reducer, usually done in thunk or component
    // But we can store the counter in state and increment it here.
    // However, existing usage expects a synchronous return of ID.
    // We'll handle ID generation in the component for now, or use a separate action to increment.
    // For now, let's keep it simple: Components generate IDs or we assume we pass a full node object.

    // -------------------------------------------------------------------------
    // History
    // -------------------------------------------------------------------------
    undo: (state) => {
      if (state.past.length === 0) return;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);

      state.future = [{ nodes: state.nodes, edges: state.edges }, ...state.future];
      state.nodes = previous.nodes;
      state.edges = previous.edges;
      state.past = newPast;
    },

    redo: (state) => {
      if (state.future.length === 0) return;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      state.past = [...state.past, { nodes: state.nodes, edges: state.edges }];
      state.nodes = next.nodes;
      state.edges = next.edges;
      state.future = newFuture;
    },

    clearCanvas: (state) => {
      state.past.push({ nodes: state.nodes, edges: state.edges });
      state.future = [];
      state.nodes = [];
      state.edges = [];
    },

    // -------------------------------------------------------------------------
    // ID Management
    // -------------------------------------------------------------------------
    incrementNodeID: (state, action) => {
      const type = action.payload;
      if (state.nodeIDs[type] === undefined) {
        state.nodeIDs[type] = 0;
      }
      state.nodeIDs[type] += 1;
    }
  },
});

export const {
  onNodesChange,
  onEdgesChange,
  addNode,
  removeNode,
  updateNodeField,
  onConnect,
  setPipelineName,
  undo,
  redo,
  clearCanvas,
  incrementNodeID
} = nodesSlice.actions;

export default nodesSlice.reducer;
