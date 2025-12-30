import { configureStore } from "@reduxjs/toolkit";
import nodesReducer from "./nodesSlice";

export const store = configureStore({
  reducer: {
    nodes: nodesReducer, // 🔥 REQUIRED
  },
});
