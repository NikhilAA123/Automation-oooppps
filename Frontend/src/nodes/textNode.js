// textNode.js
// -----------------------------------------------------------------------------
// TextNode allows users to write free-form text and dynamically reference
// variables using {{variableName}} syntax.
//
// Key concepts demonstrated:
// - Dynamic handle generation based on user input
// - useMemo for efficient variable extraction
// - Auto-resizing textarea for better UX
// - Composition with BaseNode for shared layout and actions
// - Handles always visible to preserve graph structure
// -----------------------------------------------------------------------------

import { useState, useMemo } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const TextNode = ({ id, data }) => {
  // ---------------------------------------------------------------------------
  // Local state for text content
  // This belongs only to this node, so it is kept as component-level state
  // ---------------------------------------------------------------------------
  const [text, setText] = useState(data?.text || "");

  // ---------------------------------------------------------------------------
  // Extract variables from text using {{variableName}} syntax
  //
  // - Uses regex to match valid JavaScript variable identifiers
  // - useMemo ensures we only recompute when text changes
  // - Prevents duplicate variable handles
  //
  // This logic directly satisfies Part 3 of the assignment
  // ---------------------------------------------------------------------------
  const variables = useMemo(() => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const matches = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }

    return matches;
  }, [text]);

  // ---------------------------------------------------------------------------
  // Dynamically calculate textarea height
  // - Grows as user types more content
  // - Improves visibility and usability
  // - Height is clamped to avoid excessive expansion
  // ---------------------------------------------------------------------------
  const textareaHeight = Math.max(
    60,
    Math.min(200, 60 + Math.floor(text.length / 30) * 20)
  );

  // ---------------------------------------------------------------------------
  // React Flow Handles
  //
  // - One input handle per detected variable (left side)
  // - One output handle for downstream nodes (right side)
  // - Handles are always rendered so connections remain intact when minimized
  // ---------------------------------------------------------------------------
  const handles = (
    <>
      {/* Dynamic input handles generated from detected variables */}
      {variables.map((varName, index) => (
        <Handle
          key={`${id}-${varName}`}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{
            top: `${30 + index * 25}%`,
            width: 8,
            height: 8,
            background: "#fff",
            border: "2px solid #6366f1",
            borderRadius: "50%",
            left: -4,
          }}
        />
      ))}

      {/* Output handle */}
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
    // -------------------------------------------------------------------------
    // BaseNode usage
    // - BaseNode handles layout, header, delete/minimize logic
    // - TextNode injects only its unique behavior and UI
    // -------------------------------------------------------------------------
    <BaseNode id={id} title="Text" handles={handles}>
      {/* ---------------------------------------------------------------------
          Description
          - Explains the purpose of the Text node to the user
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
          Accepts text from upstream nodes and allows you to write additional
          text
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          Text Input
          - Controlled textarea
          - Auto-resizes based on content
          - Placeholder hints dynamic variable usage
         --------------------------------------------------------------------- */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 12, color: "#64748b" }}>Text ⓘ</span>
          <span style={{ fontSize: 11, color: "#6366f1" }}>Text</span>
        </div>

        <textarea
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            fontSize: 12,
            color: "#1e293b",
            background: "#fff",
            outline: "none",
            resize: "none",
            height: textareaHeight,
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Use {{variableName}} to create input handles"
        />
      </div>

      {/* ---------------------------------------------------------------------
          Detected Variables Display
          - Provides feedback to users about extracted variables
          - Improves transparency and trust in dynamic behavior
         --------------------------------------------------------------------- */}
      {variables.length > 0 && (
        <div
          style={{
            background: "#f5f3ff",
            border: "1px solid #c7d2fe",
            borderRadius: 4,
            padding: "8px 10px",
            fontSize: 11,
            color: "#4338ca",
          }}
        >
          <strong>Variables:</strong> {variables.join(", ")}
        </div>
      )}
    </BaseNode>
  );
};
