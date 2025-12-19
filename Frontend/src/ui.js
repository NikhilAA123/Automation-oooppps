// ui.js
// Main UI component for the pipeline builder. 
// Sets up the React Flow canvas, handles drag-and-drop interactions, and renders UI overlays.

import { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";

import { InputNode } from "./nodes/inputNode";
import { LLMNode } from "./nodes/llmNode";
import { OutputNode } from "./nodes/outputNode";
import { TextNode } from "./nodes/textNode";
import { APINode } from "./nodes/APINode";
import { FilterNode } from "./nodes/FilterNode";
import { MathNode } from "./nodes/MathNode";
import { DelayNode } from "./nodes/DelayNode";
import { ConditionNode } from "./nodes/ConditionNode";
import { CustomEdge } from "./CustomEdge";

import "reactflow/dist/style.css";

const HEADER_HEIGHT = 100; // Enlarged header area to reduce canvas coverage proportion

// Mapping of node types to their respective React components
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: APINode,
  filter: FilterNode,
  math: MathNode,
  delay: DelayNode,
  condition: ConditionNode,
};

// Custom edge types with delete button
const edgeTypes = {
  custom: CustomEdge,
};

// Zustand selector to extract necessary state and actions
const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  undo: state.undo,
  redo: state.redo,
  clearCanvas: state.clearCanvas,
  pipelineName: state.pipelineName,
  setPipelineName: state.setPipelineName,
  past: state.past,
  future: state.future,
});

export const PipelineUI = () => {
  const wrapperRef = useRef(null); // Reference to the canvas wrapper div
  const [rfInstance, setRfInstance] = useState(null); // React Flow instance for projecting coordinates
  const [zoom, setZoom] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    undo,
    redo,
    clearCanvas,
    pipelineName,
    setPipelineName,
    past,
    future,
  } = useStore(selector, shallow);

  const [savingStatus, setSavingStatus] = useState("saved"); // 'saved' or 'saving'
  const [lastSaved, setLastSaved] = useState(new Date().toLocaleTimeString());

  // Debounced effect to simulate auto-saving when workspace changes
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      setSavingStatus("saving");
      const timer = setTimeout(() => {
        setSavingStatus("saved");
        setLastSaved(new Date().toLocaleTimeString());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [nodes, edges]);

  /**
   * Handles dropping a dragged node onto the canvas.
   * Calculates the position based on the mouse event and adds the node to the store.
   */
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!rfInstance || !wrapperRef.current) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const data = event.dataTransfer.getData("application/reactflow");

      if (!data) return;

      const { nodeType } = JSON.parse(data);

      // Project client coordinates to React Flow internal coordinate system
      const position = rfInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const id = getNodeID(nodeType);

      addNode({
        id,
        type: nodeType,
        position,
        data: { id },
      });
    },
    [rfInstance, addNode, getNodeID]
  );

  // Export pipeline as JSON file
  const downloadPipeline = () => {
    const data = { nodes, edges, pipelineName };
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${pipelineName.replace(/\s+/g, "_")}.json`;
    link.click();
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleModalAddNode = (type) => {
    const id = getNodeID(type);
    // Center-ish position
    const position = { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 50 };

    addNode({
      id,
      type,
      position,
      data: { id },
    });
    setIsModalOpen(false);
  };

  // Shared button style for header actions
  const headerBtnStyle = (disabled) => ({
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: 13,
    fontWeight: 500,
    color: disabled ? "#94a3b8" : "#475569",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "all 0.2s",
    opacity: disabled ? 0.6 : 1,
  });

  return (
    <>
      {/* Page Heading & Controls */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px 0 64px',
        zIndex: 1000,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}>
        {/* Left - Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="text"
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#0f172a',
              background: 'transparent',
              border: '1px solid transparent',
              outline: 'none',
              padding: '4px 8px',
              borderRadius: 4,
              transition: 'all 0.2s',
              width: 'auto',
              minWidth: 200,
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#e2e8f0'}
            onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
            onFocus={(e) => e.target.style.background = '#fff'}
            onBlur={(e) => e.target.style.background = 'transparent'}
          />
        </div>

        {/* Center/Right - Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Undo/Redo Group */}
          <div style={{ display: 'flex', gap: 4, borderRight: '1px solid #e2e8f0', paddingRight: 12, marginRight: 4 }}>
            <button
              onClick={undo}
              disabled={past.length === 0}
              style={headerBtnStyle(past.length === 0)}
              title="Undo (Ctrl+Z)"
            >
              ↩ Undo
            </button>
            <button
              onClick={redo}
              disabled={future.length === 0}
              style={headerBtnStyle(future.length === 0)}
              title="Redo (Ctrl+Y)"
            >
              Redo ↪
            </button>
          </div>

          {/* Utility Group */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={downloadPipeline}
              style={headerBtnStyle(nodes.length === 0)}
              disabled={nodes.length === 0}
              title="Download Pipeline as JSON"
            >
              📥 Export JSON
            </button>
            <button
              onClick={clearCanvas}
              style={{
                ...headerBtnStyle(false),
                color: '#ef4444',
              }}
              onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
              onMouseLeave={(e) => e.target.style.background = '#fff'}
            >
              🗑 Clear Canvas
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Wrapper */}
      <div
        ref={wrapperRef}
        style={{
          position: "fixed",
          top: HEADER_HEIGHT + 20,
          left: 20,
          right: 20,
          bottom: 20,
          backgroundColor: "#f1f5f9",
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}
      >
        {/* 'Draft saved' indicator */}
        <div
          style={{
            position: "fixed",
            top: 24, // Move it up to the header area
            right: 120, // Next to the submit button area/offset
            fontSize: 12,
            color: savingStatus === "saving" ? "#6366f1" : "#16a34a",
            display: "flex",
            alignItems: "center",
            gap: 6,
            zIndex: 1100, // Make sure it's above the header
            fontWeight: 500,
            background: "#fff",
            padding: "4px 10px",
            borderRadius: 20,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            transition: "color 0.3s ease",
          }}
        >
          <span style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: savingStatus === "saving" ? "#6366f1" : "#16a34a",
            display: "inline-block",
            animation: savingStatus === "saving" ? "pulse 1s infinite" : "none"
          }}></span>
          {savingStatus === "saving" ? "Saving..." : `Draft saved at ${lastSaved}`}
        </div>

        {/* Pulse animation for saving state */}
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.4; }
              50% { opacity: 1; }
              100% { opacity: 0.4; }
            }
          `}
        </style>

        {/* Empty State Call-to-Action */}
        {nodes.length === 0 && (
          <div
            className="add-node-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Your First Node
          </div>
        )}

        {/* Zoom Percentage Indicator */}
        <div
          style={{
            position: "fixed",
            bottom: 120, // Positioned above the controls
            right: 230,  // Aligned with the controls
            fontSize: 12,
            background: "#ffffff",
            padding: "4px 8px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            zIndex: 1000,
          }}
        >
          {Math.round(zoom * 100)}%
        </div>

        {/* React Flow Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setRfInstance}
          onMove={(_, viewport) => setZoom(viewport.zoom)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: 'custom' }}
        >
          <Background variant="dots" gap={24} size={1} color="#000000ff" />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Node Selection Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span>Select the Node</span>
              <span onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer', fontSize: 18 }}>✕</span>
            </div>
            <div className="modal-body">
              {/* Card Options */}
              <div className="modal-option-card" onClick={() => handleModalAddNode('customInput')}>
                <div className="modal-option-title">Input Node</div>
                <div className="modal-option-desc">Start your workflow with an input. Pass values like text or files.</div>
              </div>
              <div className="modal-option-card" onClick={() => handleModalAddNode('llm')}>
                <div className="modal-option-title">LLM Engine</div>
                <div className="modal-option-desc">Use a Large Language Model to process and generate text.</div>
              </div>
              <div className="modal-option-card" onClick={() => handleModalAddNode('customOutput')}>
                <div className="modal-option-title">Output Node</div>
                <div className="modal-option-desc">Define the final output or result of your pipeline.</div>
              </div>
              <div className="modal-option-card" onClick={() => handleModalAddNode('text')}>
                <div className="modal-option-title">Text / Template</div>
                <div className="modal-option-desc">Add static text or use variables for templating.</div>
              </div>
              {/* Dummy Nodes */}
              <div className="modal-option-card" onClick={() => handleModalAddNode('api')}>
                <div className="modal-option-title">API Node</div>
                <div className="modal-option-desc">Connect your workflow to external services and APIs.</div>
              </div>
              <div className="modal-option-card" onClick={() => handleModalAddNode('filter')}>
                <div className="modal-option-title">Filter Node</div>
                <div className="modal-option-desc">Filter and transform data based on custom rules.</div>
              </div>
              <div className="modal-option-card" onClick={() => handleModalAddNode('math')}>
                <div className="modal-option-title">Math Node</div>
                <div className="modal-option-desc">Perform mathematical operations on numeric values.</div>
              </div>
              <div className="modal-option-card" onClick={() => handleModalAddNode('delay')}>
                <div className="modal-option-title">Delay Node</div>
                <div className="modal-option-desc">Add pauses or timeouts to your workflow execution.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
