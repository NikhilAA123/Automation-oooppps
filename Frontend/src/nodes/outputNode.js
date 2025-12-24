// outputNode.js
// -----------------------------------------------------------------------------
// OutputNode represents the final destination of a pipeline.
// It defines how processed data should be exposed as the workflow output.
//
// Key concepts demonstrated:
// - Clear pipeline termination point
// - Synchronization between local UI state and global pipeline state
// - Reuse of BaseNode abstraction for consistency
// - Handles always visible to preserve graph structure
// -----------------------------------------------------------------------------

import { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";

// Select only the required action from the global store
// This minimizes re-renders and improves performance
const selector = (state) => ({
  updateNodeField: state.updateNodeField,
});

export const OutputNode = ({ id, data }) => {
  // Access global state updater
  // Used to persist output configuration inside the pipeline store
  const { updateNodeField } = useStore(selector, shallow);

  // ---------------------------------------------------------------------------
  // Local UI state
  // - currName: display name for the output
  // - outputType: type of data being produced
  // These are kept local for responsive UI updates
  // ---------------------------------------------------------------------------
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_")
  );

  const [outputType, setOutputType] = useState(data?.outputType || "Text");

  // Handle output name change (UI-only)
  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  // Handle output type change
  // Also sync the value to the global pipeline state
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setOutputType(newType);
    updateNodeField(id, "outputType", newType);
  };

  // ---------------------------------------------------------------------------
  // Ensure outputType is initialized in global state
  // This keeps the pipeline definition consistent even if
  // the node was created without explicit data
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!data?.outputType) {
      updateNodeField(id, "outputType", outputType);
    }
  }, [id, outputType, data?.outputType, updateNodeField]);

  // ---------------------------------------------------------------------------
  // React Flow Handle
  // - Target handle (left): receives final data from upstream node
  // - Always rendered so connectivity is preserved when minimized
  // ---------------------------------------------------------------------------
  const handles = (
    <Handle
      type="target"
      position={Position.Left}
      id={`${id}-value`}
      style={{
        width: 8,
        height: 8,
        background: "#fff",
        border: "2px solid #6366f1",
        borderRadius: "50%",
        left: -4,
      }}
    />
  );

  return (
    // -------------------------------------------------------------------------
    // BaseNode usage
    // - BaseNode manages layout, header, styling, and node actions
    // - OutputNode injects only output-specific configuration UI
    // -------------------------------------------------------------------------
    <BaseNode id={id} title="Output" handles={handles}>
      {/* ---------------------------------------------------------------------
          Description
          - Explains the role of the Output node to the user
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
          Define the final output of your workflow
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          Output Name Input
          - Allows users to label the final output
          - Improves clarity in complex pipelines
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
          Output Type Selection
          - Defines the type of data produced by the workflow
          - Stored in global state for downstream consumers
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
        value={outputType}
        onChange={handleTypeChange}
      >
        <option value="Text">Text</option>
        <option value="File">File</option>
      </select>
    </BaseNode>
  );
};
