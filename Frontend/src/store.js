// store.js
// State management using Zustand for the React Flow application.
// Handles nodes, edges, and their interactions (add, remove, connect, update).
// Includes history tracking (Undo/Redo) and utility actions.

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {}, // Track counts for each node type
  pipelineName: "Untitled Pipeline",

  // History state
  past: [],
  future: [],

  // Helper to save current state to history before a change
  saveToHistory: () => {
    const { nodes, edges } = get();
    set({
      past: [...get().past, { nodes, edges }],
      future: [], // Clear future on new action
    });
  },

  setPipelineName: (name) => set({ pipelineName: name }),

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    get().saveToHistory();
    set({
      nodes: [...get().nodes, node]
    });
  },

  onNodesChange: (changes) => {
    // Only save to history if it's a structural change (not just position/dragging for noise reduction)
    // Actually, for simplicity, let's just save.
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    get().saveToHistory();
    const { source, target } = connection;
    const nodes = get().nodes;

    const sourceNode = nodes.find((node) => node.id === source);
    const targetNode = nodes.find((node) => node.id === target);

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

    set({
      edges: addEdge({ ...connection, ...edgeOptions }, get().edges),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    // No history for field typing to avoid bloat, save on blur or explicit actions if needed
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },

  removeNode: (nodeId) => {
    get().saveToHistory();
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },

  // --- Advanced Utility Actions ---

  undo: () => {
    const { past, nodes, edges, future } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      past: newPast,
      nodes: previous.nodes,
      edges: previous.edges,
      future: [{ nodes, edges }, ...future],
    });
  },

  redo: () => {
    const { future, nodes, edges, past } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      future: newFuture,
      nodes: next.nodes,
      edges: next.edges,
      past: [...past, { nodes, edges }],
    });
  },

  clearCanvas: () => {
    if (window.confirm("Are you sure you want to clear the entire workspace? This cannot be undone.")) {
      get().saveToHistory();
      set({
        nodes: [],
        edges: [],
      });
    }
  },
}));
