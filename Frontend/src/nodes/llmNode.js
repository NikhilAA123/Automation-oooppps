// llmNode.js
// -----------------------------------------------------------------------------
// LLMNode represents an AI processing unit in the pipeline.
// Redux is used as the single source of truth for prompts and model selection.
// -----------------------------------------------------------------------------

import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { updateNodeField } from "../store/nodesSlice";
import llmIcon from "../assets/llm-icon.png";

export const LLMNode = ({ id }) => {
  const dispatch = useDispatch();

  // ---------------------------------------------------------------------------
  // Select node-specific data from Redux store
  // ---------------------------------------------------------------------------
  const nodeData = useSelector(
    (state) => state.nodes.nodes.find((node) => node.id === id)?.data
  );

  const systemPrompt =
    nodeData?.systemPrompt ||
    "Answer the Question based on Context in a professional manner.";

  const userPrompt = nodeData?.userPrompt || "";
  const model = nodeData?.model || "gpt-4";

  // ---------------------------------------------------------------------------
  // Handlers → dispatch updates to Redux
  // ---------------------------------------------------------------------------
  const handleSystemPromptChange = (e) => {
    dispatch(
      updateNodeField({
        id,
        field: "systemPrompt",
        value: e.target.value,
      })
    );
  };

  const handleUserPromptChange = (e) => {
    dispatch(
      updateNodeField({
        id,
        field: "userPrompt",
        value: e.target.value,
      })
    );
  };

  const handleModelChange = (e) => {
    dispatch(
      updateNodeField({
        id,
        field: "model",
        value: e.target.value,
      })
    );
  };

  // ---------------------------------------------------------------------------
  // React Flow Handles
  // ---------------------------------------------------------------------------
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
    <BaseNode id={id} title="LLM" icon={llmIcon} handles={handles}>
      {/* Node Identifier */}
      <div
        style={{
          padding: "8px 10px",
          background: "#f8fafc",
          borderRadius: 4,
          marginBottom: 10,
          textAlign: "center",
          fontSize: 13,
        }}
      >
        {id.replace("llm-", "llm_")}
      </div>

      {/* System Prompt */}
      <textarea
        value={systemPrompt}
        onChange={handleSystemPromptChange}
        placeholder="System instructions"
        style={{
          width: "100%",
          minHeight: 60,
          marginBottom: 10,
          boxSizing: 'border-box', // Ensures padding doesn't push width > 100%
          padding: 8,
          borderRadius: 4,
          border: '1px solid #e2e8f0'
        }}
      />

      {/* User Prompt */}
      <textarea
        value={userPrompt}
        onChange={handleUserPromptChange}
        placeholder='Type "{{" to use variables'
        style={{
          width: "100%",
          minHeight: 60,
          marginBottom: 10,
          boxSizing: 'border-box',
          padding: 8,
          borderRadius: 4,
          border: '1px solid #e2e8f0'
        }}
      />

      {/* Model Selection */}
      <select value={model} onChange={handleModelChange}>
        <option value="gpt-4">gpt-4</option>
        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
        <option value="gpt-4-turbo">gpt-4-turbo</option>
      </select>
    </BaseNode>
  );
};
