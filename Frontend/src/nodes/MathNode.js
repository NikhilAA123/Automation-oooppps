// MathNode.js
// -----------------------------------------------------------------------------
// MathNode represents a transformation step in the pipeline.
// It applies a mathematical operation to incoming numeric data
// before passing the result to downstream nodes.
//
// Key concepts demonstrated:
// - Extension of the BaseNode abstraction
// - Simple, explicit configuration for transformations
// - Controlled inputs for predictable behavior
// - Handles always visible to preserve graph connectivity
// -----------------------------------------------------------------------------

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import mathIcon from "../assets/math-icon.png";

export const MathNode = ({ id, data }) => {
  // -------------------------------------------------------------------------
  // Local state for math configuration
  // - operation determines how incoming data is transformed
  // - Kept local since it only affects this node’s behavior
  // -------------------------------------------------------------------------
  const [operation, setOperation] = useState(data?.operation || "add");

  // -------------------------------------------------------------------------
  // React Flow Handles
  // - Target handle (left): receives numeric input
  // - Source handle (right): outputs transformed value
  // Handles are always rendered, even when the node is minimized.
  // -------------------------------------------------------------------------
  const handles = (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-input`}
        style={{
          width: 8,
          height: 8,
          background: "#fff",
          border: "2px solid #6366f1",
          borderRadius: "50%",
          left: -4,
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          width: 8,
          height: 8,
          background: "#fff",
          border: "2px solid #6366f1",
          borderRadius: "50%",
          right: -4,
        }}
      />
    </>
  );

  return (
    // ---------------------------------------------------------------------
    // BaseNode usage
    // - BaseNode handles layout, header, styling, and node actions
    // - MathNode injects only math-specific configuration UI
    // ---------------------------------------------------------------------
    <BaseNode id={id} title="Math" icon={mathIcon} handles={handles}>
      {/* -----------------------------------------------------------------
                Description
                - Explains the role of the Math node to the user
               ----------------------------------------------------------------- */}
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
          Perform mathematical operations on data
        </div>
      </div>

      {/* -----------------------------------------------------------------
                Operation Selection
                - Defines which mathematical transformation to apply
                - Dropdown keeps configuration simple and explicit
               ----------------------------------------------------------------- */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 12, color: "#64748b" }}>Operation ⓘ</span>
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
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="add">Add (+)</option>
          <option value="subtract">Subtract (−)</option>
          <option value="multiply">Multiply (×)</option>
          <option value="divide">Divide (÷)</option>
        </select>
      </div>
    </BaseNode>
  );
};
