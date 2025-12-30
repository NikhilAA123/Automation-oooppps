// inputNode.js
// -----------------------------------------------------------------------------
// InputNode represents an entry point into the pipeline.
// It allows users to inject data (Text / File) into the workflow.
//
// Key concepts demonstrated:
// - Redux as the single source of truth for node data
// - BaseNode abstraction for shared layout & behavior
// - Controlled inputs backed by global state
// - Handles always visible to preserve graph structure
// -----------------------------------------------------------------------------

import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { updateNodeField } from "../store/nodesSlice";

export const InputNode = ({ id }) => {
  // ---------------------------------------------------------------------------
  // Redux hooks
  // - useDispatch: dispatches state updates
  // - useSelector: reads the current node data from the global store
  // ---------------------------------------------------------------------------
  const dispatch = useDispatch();

  const nodeData = useSelector(
    (state) => state.nodes.nodes.find((node) => node.id === id)?.data
  );

  // ---------------------------------------------------------------------------
  // Derived values from Redux state
  // - These values are NOT duplicated in local state
  // - Redux remains the single source of truth
  // ---------------------------------------------------------------------------
  const inputName =
    nodeData?.inputName || id.replace("customInput-", "input_");

  const inputType = nodeData?.inputType || "Text";

  // ---------------------------------------------------------------------------
  // Handlers
  // - Dispatch updates directly to Redux
  // - Keeps state predictable and debuggable
  // ---------------------------------------------------------------------------
  const handleNameChange = (e) => {
    dispatch(
      updateNodeField({
        id,
        field: "inputName",
        value: e.target.value,
      })
    );
  };

  const handleTypeChange = (e) => {
    dispatch(
      updateNodeField({
        id,
        field: "inputType",
        value: e.target.value,
      })
    );
  };

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
          - Controlled input backed by Redux state
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
          value={inputName}
          onChange={handleNameChange}
        />
      </div>

      {/* ---------------------------------------------------------------------
          UX Suggestion
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
          - Stored in Redux so downstream nodes can react to it
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
