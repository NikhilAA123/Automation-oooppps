// outputNode.js
// -----------------------------------------------------------------------------
// OutputNode represents the final destination of a pipeline.
// It defines how processed data should be exposed as the workflow output.
//
// Key concepts demonstrated:
// - Clear pipeline termination point
// - Redux as the single source of truth for node data
// - Reuse of BaseNode abstraction for consistency
// - Handles always visible to preserve graph structure
// -----------------------------------------------------------------------------

import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { updateNodeField } from "../store/nodesSlice";

export const OutputNode = ({ id }) => {
  // ---------------------------------------------------------------------------
  // Redux hooks
  // ---------------------------------------------------------------------------
  const dispatch = useDispatch();

  const nodeData = useSelector(
    (state) => state.nodes.nodes.find((node) => node.id === id)?.data
  );

  // ---------------------------------------------------------------------------
  // Derived values from Redux state
  // Redux is the single source of truth
  // ---------------------------------------------------------------------------
  const outputName =
    nodeData?.outputName || id.replace("customOutput-", "output_");

  const outputType = nodeData?.outputType || "Text";

  // ---------------------------------------------------------------------------
  // Handlers
  // - Dispatch updates directly to Redux
  // ---------------------------------------------------------------------------
  const handleNameChange = (e) => {
    dispatch(
      updateNodeField({
        id,
        field: "outputName",
        value: e.target.value,
      })
    );
  };

  const handleTypeChange = (e) => {
    dispatch(
      updateNodeField({
        id,
        field: "outputType",
        value: e.target.value,
      })
    );
  };

  // ---------------------------------------------------------------------------
  // React Flow Handle
  // - Target handle receives final data from upstream node
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
          - Controlled input backed by Redux
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
          value={outputName}
          onChange={handleNameChange}
        />
      </div>

      {/* ---------------------------------------------------------------------
          Output Type Selection
          - Stored in Redux for downstream consumers
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
