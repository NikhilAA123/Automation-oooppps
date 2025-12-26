// inputNode.js
// -----------------------------------------------------------------------------
// InputNode represents an entry point into the pipeline.
// It allows users to inject data (Text / File) into the workflow.
//
// Key concepts demonstrated:
// - Reuse of BaseNode abstraction
// - Separation of local UI state and global pipeline state
// - Controlled inputs for predictable behavior
// - Handles always visible to preserve graph structure
// -----------------------------------------------------------------------------

import { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export const InputNode = ({ id, data }) => {
  // Access global state update function
  const updateNodeField = useStore((state) => state.updateNodeField);

  // ---------------------------------------------------------------------------
  // Local UI state
  // - currName: display name for the input node
  // - inputType: data type emitted by this node
  // These are kept local for fast UI updates
  // ---------------------------------------------------------------------------

  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );

  const [inputType, setInputType] = useState(data?.inputType || "Text");

  // Handle name change (UI-only for now)
  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  // Handle input type change
  // Also sync the value to the global pipeline state
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setInputType(newType);
    updateNodeField(id, "inputType", newType);
  };

  // ---------------------------------------------------------------------------
  // Sync default inputType to global store on first render
  // This ensures pipeline state remains consistent even if
  // the node was created without explicit data
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!data?.inputType) {
      updateNodeField(id, "inputType", inputType);
    }
  }, [id, inputType, data?.inputType, updateNodeField]);

  // ---------------------------------------------------------------------------
  // React Flow Handle
  // - Source handle emits data from this input node
  // - Always rendered so connections remain visible when minimized
  // ---------------------------------------------------------------------------
  const handles = (
    <Handle
      type="source"
      position={Position.Right}
      id={`${id}-value`}
      style={{
        width: 8,
        height: 8,
        background: "#fff",
        border: "2px solid #6366f1",
        borderRadius: "50%",
        right: -4,
      }}
    />
  );

  return (
    // -------------------------------------------------------------------------
    // BaseNode usage
    // - BaseNode handles layout, header, actions, and styling
    // - InputNode injects only its unique UI and logic
    // -------------------------------------------------------------------------
    <BaseNode id={id} title="Input" handles={handles}>
      {/* ---------------------------------------------------------------------
          Description
          - Brief explanation of what this node does
         --------------------------------------------------------------------- */}
      <div
        style={{
          padding: "8px 10px",
          background: "#f8fafc",
          borderRadius: 4,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#64748b",
            lineHeight: 1.4,
          }}
        >
          Pass data of different types into your workflow
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          Name Input
          - Allows users to give the input node a meaningful identifier
          - Controlled input ensures predictable updates
         --------------------------------------------------------------------- */}
      <div
        style={{
          padding: "8px 10px",
          background: "#f8fafc",
          borderRadius: 4,
          marginBottom: 10,
        }}
      >
        <input
          type="text"
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            fontSize: 13,
            color: "#1e293b",
            outline: "none",
            textAlign: "center",
            boxSizing: "border-box",
          }}
          value={currName}
          onChange={handleNameChange}
        />
      </div>

      {/* ---------------------------------------------------------------------
          UX Suggestion
          - Small guidance to encourage better naming
          - Improves readability in large pipelines
         --------------------------------------------------------------------- */}
      <div
        style={{
          background: "#f5f3ff",
          border: "1px solid #c7d2fe",
          borderRadius: 4,
          padding: "8px 10px",
          display: "flex",
          gap: 6,
          alignItems: "flex-start",
          fontSize: 11,
          color: "#4338ca",
          marginBottom: 10,
          lineHeight: 1.4,
        }}
      >
        <span>💡</span>
        <span>
          <strong>Suggestion:</strong> Give the node a distinct name
        </span>
      </div>

      {/* ---------------------------------------------------------------------
          Input Type Selection
          - Determines what kind of data this node emits
          - Stored in global state so downstream nodes can use it
         --------------------------------------------------------------------- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 12, color: "#64748b" }}>Type ⓘ</span>
        <span style={{ fontSize: 11, color: "#6366f1" }}>Dropdown</span>
      </div>

      <select
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          fontSize: 13,
          color: "#1e293b",
          background: "#fff",
          outline: "none",
          cursor: "pointer",
          boxSizing: "border-box",
        }}
        value={inputType}
        onChange={handleTypeChange}
      >
        <option value="Text">Text</option>
        <option value="File">File</option>
      </select>
    </BaseNode>
  );
};
