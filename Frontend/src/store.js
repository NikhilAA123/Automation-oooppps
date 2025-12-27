// store.js
// -----------------------------------------------------------------------------
// Commit: Centralized state management for the Pipeline Builder.
// Purpose: 
// - Manages nodes and edges using Zustand for high-performance React updates.
// - Implements Kahn's algorithm-ready data structure for DAG validation.
// - Provides Undo/Redo history and utility actions like branching or clearing.
// - Handles typed connections and validation feedback.
// -----------------------------------------------------------------------------

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

/**
 * useStore
 * Global state hook containing the entire pipeline definition and actions.
 */
export const useStore = create((set, get) => ({
  // --- Core State ---
  nodes: [],
  edges: [],
  nodeIDs: {}, // Track auto-incrementing counts for each node type
  pipelineName: "Untitled Pipeline",

  // --- History State (Undo/Redo) ---
  past: [],
  future: [],

  /**
   * saveToHistory
   * Snapshots the current workflow state into the 'past' stack before modifications.
   */
  saveToHistory: () => {
    const { nodes, edges } = get();
    set({
      past: [...get().past, { nodes, edges }],
      future: [], // Clear redo history on any new user action
    });
  },

  setPipelineName: (name) => set({ pipelineName: name }),

  /**
   * getNodeID
   * Generates a unique, readable ID for a node based on its type (e.g., 'llm-1').
   */
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  /**
   * addNode
   * Inserts a new node into the workspace with history tracking.
   */
  addNode: (node) => {
    get().saveToHistory();
    set({
      nodes: [...get().nodes, node]
    });
  },

  /**
   * onNodesChange
   * Built-in React Flow handler for node movements, selections, and removals.
   */
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  /**
   * onEdgesChange
   * Built-in React Flow handler for edge interactions.
   */
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  /**
   * onConnect
   * Logic for creating a new connection between handles.
   * Includes type-mismatch detection and styling.
   */
  onConnect: (connection) => {
    get().saveToHistory();
    const { source, target } = connection;
    const nodes = get().nodes;

    // Find nodes involved in the connection for type checking
    const sourceNode = nodes.find((node) => node.id === source);
    const targetNode = nodes.find((node) => node.id === target);

    // Simple type matching logic (defaults to 'Text' if not specified)
    const sourceType = sourceNode?.data?.inputType || sourceNode?.data?.outputType || 'Text';
    const targetType = targetNode?.data?.inputType || targetNode?.data?.outputType || 'Text';
    const isTypeMismatch = sourceType !== targetType;

    // Define visual style based on compatibility
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

  /**
   * updateNodeField
   * Updates a specific data field within a node (e.g., changing a URL or selection).
   */
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },

  /**
   * removeNode
   * Safely deletes a node and all its associated edges.
   */
  removeNode: (nodeId) => {
    get().saveToHistory();
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },

  // --- History Navigation ---

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

  /**
   * clearCanvas
   * Wipes the entire workspace to reset for a new project.
   */
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

