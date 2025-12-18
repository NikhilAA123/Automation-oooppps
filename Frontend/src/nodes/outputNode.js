// outputNode.js
// Output node with handles always visible when minimized.

import { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
  updateNodeField: state.updateNodeField,
});

export const OutputNode = ({ id, data }) => {
  const { updateNodeField } = useStore(selector, shallow);
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_")
  );
  const [outputType, setOutputType] = useState(data?.outputType || "Text");

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setOutputType(newType);
    updateNodeField(id, 'outputType', newType);
  };

  useEffect(() => {
    if (!data?.outputType) {
      updateNodeField(id, 'outputType', outputType);
    }
  }, [id, outputType, data?.outputType, updateNodeField]);

  const handles = (
    <Handle
      type="target"
      position={Position.Left}
      id={`${id}-value`}
      style={{ width: 8, height: 8, background: '#fff', border: '2px solid #6366f1', borderRadius: '50%', left: -4 }}
    />
  );

  return (
    <BaseNode id={id} title="Output" handles={handles}>
      {/* Description */}
      <div style={{
        padding: '8px 10px',
        background: '#f8fafc',
        borderRadius: 4,
        marginBottom: 10,
      }}>
        <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
          Define the final output of your workflow
        </div>
      </div>

      {/* Name Input */}
      <div style={{
        padding: '8px 10px',
        background: '#f8fafc',
        borderRadius: 4,
        marginBottom: 10,
      }}>
        <input
          type="text"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            fontSize: 13,
            color: '#1e293b',
            outline: 'none',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
          value={currName}
          onChange={handleNameChange}
        />
      </div>

      {/* Type Selection */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#64748b' }}>Type ⓘ</span>
        <span style={{ fontSize: 11, color: '#6366f1' }}>Dropdown</span>
      </div>
      <select
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          fontSize: 13,
          color: '#1e293b',
          background: '#fff',
          outline: 'none',
          cursor: 'pointer',
          boxSizing: 'border-box',
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
