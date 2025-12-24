// FilterNode.js
// -----------------------------------------------------------------------------
// FilterNode represents a data filtering step in the pipeline.
// It evaluates incoming data based on a field, operator, and value,
// and only passes data that matches the condition.
//
// Key concepts demonstrated:
// - Extension of the BaseNode abstraction
// - Controlled inputs for predictable configuration
// - Clear modeling of common filtering logic
// - Handles always visible to preserve graph connectivity
// -----------------------------------------------------------------------------

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import filterIcon from "../assets/filter-icon.png";

export const FilterNode = ({ id, data }) => {
  // -------------------------------------------------------------------------
  // Local state for filter configuration
  // - field: property name to evaluate (e.g., status, age)
  // - operator: comparison logic (equals, contains, etc.)
  // - value: value to compare against
  // These are node-specific settings, so they remain local state
  // -------------------------------------------------------------------------
  const [field, setField] = useState(data?.field || "");

  const [operator, setOperator] = useState(data?.operator || "equals");

  const [value, setValue] = useState(data?.value || "");

  // -------------------------------------------------------------------------
  // React Flow Handles
  // - Target handle (left): receives incoming data
  // - Source handle (right): emits filtered data
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
    // - BaseNode manages layout, header, styling, and node actions
    // - FilterNode injects only filter-specific configuration UI
    // ---------------------------------------------------------------------
    <BaseNode id={id} title="Filter" icon={filterIcon} handles={handles}>
      {/* -----------------------------------------------------------------
                Description
                - Explains the role of the Filter node to the user
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
          Filter data based on a condition
        </div>
      </div>

      {/* -----------------------------------------------------------------
                Field Input
                - Specifies which field/property of the data to evaluate
               ----------------------------------------------------------------- */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 12, color: "#64748b" }}>Field ⓘ</span>
          <span style={{ fontSize: 11, color: "#6366f1" }}>Text</span>
        </div>

        <input
          type="text"
          placeholder="e.g., status"
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            fontSize: 13,
            color: "#1e293b",
            background: "#fff",
            outline: "none",
            boxSizing: "border-box",
          }}
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
      </div>

      {/* -----------------------------------------------------------------
                Operator Selection
                - Defines how the field and value should be compared
               ----------------------------------------------------------------- */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 12, color: "#64748b" }}>Operator ⓘ</span>
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
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
        >
          <option value="equals">Equals</option>
          <option value="notEquals">Not Equals</option>
          <option value="contains">Contains</option>
          <option value="greaterThan">Greater Than</option>
          <option value="lessThan">Less Than</option>
        </select>
      </div>

      {/* -----------------------------------------------------------------
                Value Input
                - Value to compare the field against
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
          <span style={{ fontSize: 12, color: "#64748b" }}>Value ⓘ</span>
          <span style={{ fontSize: 11, color: "#6366f1" }}>Text</span>
        </div>

        <input
          type="text"
          placeholder="e.g., active"
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            fontSize: 13,
            color: "#1e293b",
            background: "#fff",
            outline: "none",
            boxSizing: "border-box",
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </BaseNode>
  );
};
