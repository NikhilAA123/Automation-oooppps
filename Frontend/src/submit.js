// submit.js
// The primary action button for the pipeline builder.
// Sends pipeline data to backend and displays the analysis results.

import { useStore } from "./store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    try {
      // Send nodes and edges to backend
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Display results in a user-friendly alert
      alert(
        `Pipeline Analysis Results:\n\n` +
        `📊 Number of Nodes: ${data.num_nodes}\n` +
        `🔗 Number of Edges: ${data.num_edges}\n` +
        `✅ Is a DAG: ${data.is_dag ? "Yes" : "No"}`
      );
    } catch (error) {
      console.error("Error analyzing pipeline:", error);
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
      <button
        type="submit"
        // Styled to be fixed at the bottom-left of the screen
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
        // Hover effects for interactivity
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
