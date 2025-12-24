// APINode.js
// -----------------------------------------------------------------------------
// APINode represents an external HTTP call in the pipeline.
// It allows users to configure an API endpoint and HTTP method,
// acting as an integration point with external services.
//
// Key concepts demonstrated:
// - Reuse of BaseNode abstraction for consistent layout and actions
// - Controlled inputs for predictable configuration
// - Clear separation of node-specific logic from shared UI
// - Handles always visible to preserve graph connectivity
// -----------------------------------------------------------------------------

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import apiIcon from "../assets/api-icon.png";

export const APINode = ({ id, data }) => {
  // -------------------------------------------------------------------------
  // Local state for API configuration
  // These values are specific to this node instance and are kept local
  // for fast UI updates.
  // -------------------------------------------------------------------------

  const [url, setUrl] = useState(data?.url || "https://api.example.com");

  const [method, setMethod] = useState(data?.method || "GET");

  // -------------------------------------------------------------------------
  // React Flow Handles
  // - Target handle (left): input data for the API request
  // - Source handle (right): API response passed downstream
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
    // - BaseNode manages layout, header, minimize/delete actions
    // - APINode injects only API-specific configuration UI
    // ---------------------------------------------------------------------
    <BaseNode id={id} title="API" icon={apiIcon} handles={handles}>
      {/* -----------------------------------------------------------------
                Description
                - Brief explanation of the node’s responsibility
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
          Make an HTTP request to an external API
        </div>
      </div>

      {/* -----------------------------------------------------------------
                URL Input
                - Allows users to configure the API endpoint
                - Controlled input ensures predictable updates
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
          <span style={{ fontSize: 12, color: "#64748b" }}>URL ⓘ</span>
          <span style={{ fontSize: 11, color: "#6366f1" }}>Text</span>
        </div>

        <input
          type="text"
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
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      {/* -----------------------------------------------------------------
                HTTP Method Selection
                - Defines how the API request is made
                - Dropdown keeps the configuration simple and explicit
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
          <span style={{ fontSize: 12, color: "#64748b" }}>Method ⓘ</span>
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
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
    </BaseNode>
  );
};
