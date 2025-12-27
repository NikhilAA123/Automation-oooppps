// submit.js
// -----------------------------------------------------------------------------
// Commit: Integrated pipeline analysis trigger with backend connectivity.
// Purpose: 
// - Aggregates the graph state (nodes/edges) from the global store.
// - Transmits pipeline data to the FastAPI backend for validation.
// - Parses and displays structural metrics (node count, edge count, DAG status).
// - Provides a fixed-position action button with interactive hover effects.
// -----------------------------------------------------------------------------

import { useStore } from "./store";

/**
 * SubmitButton Component
 * The primary interface for triggering the 'Analyze' workflow.
 */
export const SubmitButton = () => {
  // Extract graph structure from the centerized store
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  /**
   * handleSubmit
   * Asynchronous handler for transmitting pipeline metadata to the backend.
   */
  const handleSubmit = async () => {
    try {
      // POST request to the analysis endpoint
      const response = await fetch("/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodes, edges }),
      });

      // Basic error handling for network or server issues
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Feedback Mechanism: Alert user with the results of the backend analysis
      alert(
        `Pipeline Analysis Results:\n\n` +
        `📊 Number of Nodes: ${data.num_nodes}\n` +
        `🔗 Number of Edges: ${data.num_edges}\n` +
        `✅ Is a DAG: ${data.is_dag ? "Yes" : "No"}`
      );
    } catch (error) {
      console.error("Error analyzing pipeline:", error);
      // Helpful fallback message if the backend service is unreachable
      alert(`Error: Could not connect to backend.\n\nMake sure the backend is running:\ncd backend && uvicorn main:app --reload`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 
          Analyze Button
          - Anchored to the viewport for constant accessibility
          - Uses project-specific CSS variables for brand consistency
      */}
      <button
        type="submit"
        style={{
          position: "fixed",
          bottom: 50,
          left: 50,
          zIndex: 1000,
          padding: "10px 20px",
          borderRadius: 8,
          border: "1px solid var(--vs-accent)",
          backgroundColor: "#ffffff",
          color: "var(--vs-accent)",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          transition: "all 0.2s ease",
        }}
        // Micro-interactions for hover states
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "var(--vs-accent)";
          e.target.style.color = "#ffffff";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#ffffff";
          e.target.style.color = "var(--vs-accent)";
        }}
        onClick={handleSubmit}
      >
        Analyze the Pipeline
      </button>
    </div>
  );
};

