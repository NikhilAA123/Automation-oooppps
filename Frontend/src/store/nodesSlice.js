// src/store/nodesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nodes: [],
  edges: [],
};

const nodesSlice = createSlice({
  name: "nodes",
  initialState,

  reducers: {
    // ✅ ADD THIS
    removeNode: (state, action) => {
      const nodeId = action.payload;

      // Remove the node
      state.nodes = state.nodes.filter(
        (node) => node.id !== nodeId
      );

      // Also remove connected edges (important!)
      state.edges = state.edges.filter(
        (edge) =>
          edge.source !== nodeId &&
          edge.target !== nodeId
      );
    },
  },
});

// ✅ Export the action
export const { removeNode } = nodesSlice.actions;

// ✅ Export the reducer
export default nodesSlice.reducer;
