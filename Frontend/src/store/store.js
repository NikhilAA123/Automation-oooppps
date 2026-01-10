import { configureStore } from "@reduxjs/toolkit";
import nodesReducer from "./nodesSlice";

// -----------------------------------------------------------------------------
// Persistence Logic
// -----------------------------------------------------------------------------
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('vectorShift_state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('vectorShift_state', serializedState);
    } catch (err) {
        // Ignore write errors
    }
};

const preloadedState = loadState();

export const store = configureStore({
    reducer: {
        nodes: nodesReducer,
    },
    preloadedState, // Initialize with persisted state
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['nodes/onNodesChange', 'nodes/onEdgesChange', 'nodes/onConnect'],
                ignoredActionPaths: ['payload.source', 'payload.target'],
                ignoredPaths: ['nodes.nodes', 'nodes.edges'],
            },
        }),
});

// Subscribe to store updates to save state
store.subscribe(() => {
    saveState({
        nodes: store.getState().nodes
    });
});
