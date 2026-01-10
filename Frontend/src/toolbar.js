// toolbar.js
// -----------------------------------------------------------------------------
// Commit: Implemented floating node-injection toolbar with search.
// Purpose: 
// - Provides a quick-access menu for dragging or clicking to add nodes.
// - Features a search/filter to handle an expanding list of node types.
// - Uses staggered diagonal positioning for clicked nodes to prevent overlap.
// - Integrates custom icons for a premium VectorShift-inspired aesthetic.
// -----------------------------------------------------------------------------

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DraggableNode } from "./draggableNode";
import { addNode, incrementNodeID } from "./store/nodesSlice";

// Import UI-specific assets
import llmIcon from "./assets/llm-icon.png";
import mathIcon from "./assets/math-icon.png";
import conditionIcon from "./assets/condition-icon.png";
import filterIcon from "./assets/filter-icon.png";
import apiIcon from "./assets/api-icon.png";
import minimizeIcon from "./assets/minimize-icon.png";
import maximizeIcon from "./assets/maximize-icon.png";

/**
 * PipelineToolbar Component
 * A floating UI element that serves as the primary source for new nodes.
 */
export const PipelineToolbar = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const nodeIDs = useSelector((state) => state.nodes.nodeIDs);

  // --- Local UI State ---
  const [isHovered, setIsHovered] = useState(false); // Controls expansion of the menu
  const [searchQuery, setSearchQuery] = useState(""); // Filters the node options

  /**
   * nodeOptions
   * Catalog of all available nodes in the system.
   */
  const nodeOptions = [
    { type: "customInput", label: "Input", icon: minimizeIcon },
    { type: "llm", label: "LLM", icon: llmIcon },
    { type: "customOutput", label: "Output", icon: maximizeIcon },
    { type: "text", label: "Text", icon: "📝" },
    { type: "api", label: "API", icon: apiIcon },
    { type: "filter", label: "Filter", icon: filterIcon },
    { type: "math", label: "Math", icon: mathIcon },
    { type: "delay", label: "Delay", icon: "⏱️" },
    { type: "condition", label: "Condition", icon: conditionIcon },
  ];

  // Logic for search filtering
  const filteredNodes = nodeOptions.filter((node) =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * handleAddNode
   * Adds a node via click instead of drag.
   * Calculates a staggered offset to ensure new nodes are visible and not stacked.
   */
  const handleAddNode = (type) => {
    // ID Generation Logic (Replicated from ui.js)
    // In a real app, this might be a custom hook useNodeID(type)
    const newId = `${type}-${(nodeIDs[type] || 0) + 1}`;
    dispatch(incrementNodeID(type));

    // Dynamic position calculation for a "scatter" or "queue" effect
    const offset = nodes.length * 40;
    const x = 300 + offset;
    const y = 80 + offset;

    dispatch(addNode({
      id: newId,
      type: type,
      position: { x, y },
      data: {},
    }));
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 30, // Aligned with the header area
        left: 12,
        zIndex: 1100,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* -----------------------------------------------------------------
          Trigger Button (Plus Icon)
          ----------------------------------------------------------------- */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: "#fff",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 24,
          color: "#64748b",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease",
          lineHeight: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#eef2ff";
          e.currentTarget.style.color = "#6366f1";
          e.currentTarget.style.borderColor = "#c7d2fe";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.color = "#64748b";
          e.currentTarget.style.borderColor = "#e2e8f0";
        }}
      >
        <span style={{ marginBottom: 4 }}>+</span>
      </div>

      {/* -----------------------------------------------------------------
          Expanded Search & Node List
          - Dynamically rendered on hover
          ----------------------------------------------------------------- */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 0,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "16px 12px",
            boxShadow: "0 12px 24px -6px rgba(0,0,0,0.15)",
            width: 240,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search bar for quick discovery */}
          <input
            type="text"
            className="toolbar-search"
            placeholder="Search Nodes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Renderable Node Icons in 2-column grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            marginTop: 4
          }}>
            {filteredNodes.length > 0 ? (
              filteredNodes.map((node) => (
                <DraggableNode
                  key={node.type}
                  type={node.type}
                  label={node.label}
                  icon={node.icon}
                  onClick={() => handleAddNode(node.type)}
                />
              ))
            ) : (
              <div style={{ fontSize: 12, color: '#94a3b8', padding: 8, gridColumn: 'span 2' }}>
                No nodes found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

