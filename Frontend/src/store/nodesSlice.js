// src/store/nodesSlice.js
// -----------------------------------------------------------------------------
// Redux slice responsible for managing pipeline nodes and edges
// Acts as the single source of truth for graph structure and node configuration
// -----------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nodes: [], // React Flow nodes
  edges: [], // React Flow edges
};

const nodesSlice = createSlice({
  name: "nodes",
  initialState,

  reducers: {
    // -------------------------------------------------------------------------
    // Remove a node and all its connected edges
    // -------------------------------------------------------------------------
    removeNode: (state, action) => {
      const nodeId = action.payload;

      // Remove the node itself
      state.nodes = state.nodes.filter(
        (node) => node.id !== nodeId
      );

      // Remove any edges connected to this node
      state.edges = state.edges.filter(
        (edge) =>
          edge.source !== nodeId &&
          edge.target !== nodeId
      );
    },

    // -------------------------------------------------------------------------
    // Update a single field inside a node's data object
    // Used by Input, Output, LLM, Text, Filter, etc.
    // -------------------------------------------------------------------------
    updateNodeField: (state, action) => {
      const { id, field, value } = action.payload;

      const node = state.nodes.find((n) => n.id === id);

      if (node) {
        node.data = {
          ...node.data,
          [field]: value,
        };
      }
    },
  },
});

// -----------------------------------------------------------------------------
// Export actions
// -----------------------------------------------------------------------------
export const { removeNode, updateNodeField } = nodesSlice.actions;

// -----------------------------------------------------------------------------
// Export reducer
// -----------------------------------------------------------------------------
export default nodesSlice.reducer;
