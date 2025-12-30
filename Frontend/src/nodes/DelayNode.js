// DelayNode.js
// -----------------------------------------------------------------------------
// DelayNode introduces a time-based pause in the pipeline execution.
// It allows users to delay the flow before passing data to the next node.
//
// Redux responsibilities:
// - Persist delay configuration (duration + unit) in global pipeline state
// - Enable execution engine to apply correct delay at runtime
// -----------------------------------------------------------------------------

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { updateNodeField } from "../store/nodesSlice";

export const DelayNode = ({ id, data }) => {
  const dispatch = useDispatch();

  // -------------------------------------------------------------------------
  // Local UI state
  // - duration: numeric delay value
  // - unit: time unit (ms / s / m)
  // Local state ensures responsive UI while Redux stores pipeline definition
  // -------------------------------------------------------------------------
  const [duration, setDuration] = useState(data?.duration || 1000);
  const [unit, setUnit] = useState(data?.unit || "ms");

  // -------------------------------------------------------------------------
  // Initialize Redux state on mount
  // Ensures delay config always exists in pipeline state
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!data?.duration) {
      dispatch(
        updateNodeField({
          id,
          field: "duration",
          value: duration,
        })
      );
    }

    if (!data?.unit) {
      dispatch(
        updateNodeField({
          id,
          field: "unit",
          value: unit,
        })
      );
    }
  }, [id, data, duration, unit, dispatch]);

  // -------------------------------------------------------------------------
  // Handle duration change
  // - Updates local UI
  // - Syncs value to Redux store
  // -------------------------------------------------------------------------
  const handleDurationChange = (e) => {
    const value = Number(e.target.value);
    setDuration(value);

    dispatch(
      updateNodeField({
        id,
        field: "duration",
        value,
      })
    );
  };

  // -------------------------------------------------------------------------
  // Handle unit change
  // -------------------------------------------------------------------------
  const handleUnitChange = (e) => {
    const value = e.target.value;
    setUnit(value);

    dispatch(
      updateNodeField({
        id,
        field: "unit",
        value,
      })
    );
  };

  // -------------------------------------------------------------------------
  // React Flow Handles
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
    // - DelayNode injects only delay-specific configuration UI
    // ---------------------------------------------------------------------
    <BaseNode id={id} title="Delay" handles={handles}>
      {/* -----------------------------------------------------------------
                Description
                - Explains the role of this node to the user
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
          Add a time delay before the next step
        </div>
      </div>

      {/* -----------------------------------------------------------------
                Duration Input
                - Numeric value representing how long to delay
                - Minimum enforced to avoid negative delays
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
          <span style={{ fontSize: 12, color: "#64748b" }}>Duration ⓘ</span>
          <span style={{ fontSize: 11, color: "#6366f1" }}>Number</span>
        </div>

        <input
          type="number"
          min="0"
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
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      {/* -----------------------------------------------------------------
                Unit Selection
                - Determines the time unit for the delay
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
          <span style={{ fontSize: 12, color: "#64748b" }}>Unit ⓘ</span>
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
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="ms">Milliseconds</option>
          <option value="s">Seconds</option>
          <option value="m">Minutes</option>
        </select>
      </div>
    </BaseNode>
  );
};
