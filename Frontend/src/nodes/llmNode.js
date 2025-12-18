// llmNode.js
// LLM node with OpenAI icon and handles always visible when minimized.

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import llmIcon from "../assets/llm-icon.png";

export const LLMNode = ({ id, data }) => {
  const [systemPrompt, setSystemPrompt] = useState(data?.systemPrompt || "Answer the Question based on Context in a professional manner.");
  const [userPrompt, setUserPrompt] = useState(data?.userPrompt || "");
  const [model, setModel] = useState(data?.model || "gpt-4");

  // Smaller handles (8px)
  const handles = (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-input`}
        style={{ width: 8, height: 8, background: '#fff', border: '2px solid #6366f1', borderRadius: '50%', left: -4 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ width: 8, height: 8, background: '#fff', border: '2px solid #6366f1', borderRadius: '50%', right: -4 }}
      />
    </>
  );

  return (
    <BaseNode id={id} title="LLM" icon={llmIcon} handles={handles}>
      {/* Node Name */}
      <div style={{
        padding: '8px 10px',
        background: '#f8fafc',
        borderRadius: 4,
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 13,
        color: '#1e293b',
      }}>
        {id.replace("llm-", "llm_")}
      </div>

      {/* System Instructions */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>System (Instructions) ⓘ</span>
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
            resize: 'vertical',
            minHeight: 60,
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </div>

      {/* Prompt */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Prompt ⓘ</span>
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
            resize: 'vertical',
            minHeight: 60,
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder='Type "{{" to use variables'
        />
      </div>

      {/* Model Selection */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Model ⓘ</span>
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
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="gpt-4">gpt-4</option>
          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          <option value="gpt-4-turbo">gpt-4-turbo</option>
        </select>
      </div>
    </BaseNode>
  );
};
