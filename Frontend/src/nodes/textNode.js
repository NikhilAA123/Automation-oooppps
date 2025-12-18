// textNode.js
// Text node with dynamic variable handles.

import { useState, useMemo } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || "");

  // Extract variables from text and create dynamic handles
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

  // Calculate dynamic height based on text length
  const textareaHeight = Math.max(60, Math.min(200, 60 + Math.floor(text.length / 30) * 20));

  // Handles - always visible
  const handles = (
    <>
      {/* Dynamic input handles for variables */}
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
            background: '#fff',
            border: '2px solid #6366f1',
            borderRadius: '50%',
            left: -4,
          }}
        />
      ))}
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ width: 8, height: 8, background: '#fff', border: '2px solid #6366f1', borderRadius: '50%', right: -4 }}
      />
    </>
  );

  return (
    <BaseNode id={id} title="Text" handles={handles}>
      {/* Description */}
      <div style={{
        padding: '8px 10px',
        background: '#f8fafc',
        borderRadius: 4,
        marginBottom: 10,
      }}>
        <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
          Accepts Text from upstream nodes and allows you to write additional text
        </div>
      </div>

      {/* Text Input */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Text ⓘ</span>
          <span style={{ fontSize: 11, color: '#6366f1' }}>Text</span>
        </div>
        <textarea
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            fontSize: 12,
            color: '#1e293b',
            background: '#fff',
            outline: 'none',
            resize: 'none',
            height: textareaHeight,
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Use {{variableName}} to create input handles'
        />
      </div>

      {/* Show detected variables */}
      {variables.length > 0 && (
        <div style={{
          background: '#f5f3ff',
          border: '1px solid #c7d2fe',
          borderRadius: 4,
          padding: '8px 10px',
          fontSize: 11,
          color: '#4338ca',
        }}>
          <strong>Variables:</strong> {variables.join(', ')}
        </div>
      )}
    </BaseNode>
  );
};
