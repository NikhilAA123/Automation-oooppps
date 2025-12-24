// BaseNode.js
// -----------------------------------------------------------------------------
// This component is the shared base container for ALL node types in the pipeline.
// It provides:
//  - Consistent layout and styling
//  - Header with icon, title, minimize/maximize, and delete actions
//  - Confirmation dialog for safe deletion
//  - Minimize behavior while keeping handles active
//  - Composition-based design so child nodes inject their own content & handles
// -----------------------------------------------------------------------------

import { useState } from "react";
import { useStore } from "../store"; // Zustand store for global state
import { shallow } from "zustand/shallow"; // Prevents unnecessary re-renders

// Import UI icons
import maximizeIcon from "../assets/maximize-icon.png";
import minimizeIcon from "../assets/minimize-icon.png";

// Selector pattern:
// We only subscribe to removeNode to keep re-renders minimal
const selector = (state) => ({
  removeNode: state.removeNode,
});

// BaseNode component
export const BaseNode = ({ id, title, icon, children, handles }) => {
  // Get removeNode action from global Zustand store
  // Node deletion is handled centrally (important for undo/redo & consistency)
  const { removeNode } = useStore(selector, shallow);

  // Local UI-only state
  // These do NOT belong in global store
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Trigger delete confirmation dialog
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  // Confirm deletion → remove node from global state
  const handleConfirmDelete = () => {
    removeNode(id);
    setShowDeleteDialog(false);
  };

  // Cancel deletion → just close dialog
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  // Toggle minimize / maximize state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      style={{
        width: 260,
        background: "#ffffff",
        border: "1px solid #c7d2fe",
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "visible", // Important: allows handles to extend outside
      }}
    >
      {/* ---------------------------------------------------------------------
          Node Header
          - Consistent header across all nodes
          - Light-blue background inspired by VectorShift UI
          - Contains icon, title, and action buttons
         --------------------------------------------------------------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderBottom: isMinimized ? "none" : "1px solid #c7d2fe",
          background: "#eef2ff",
          borderRadius: isMinimized ? 8 : "8px 8px 0 0",
        }}
      >
        {/* Left side: Icon + Node Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon && <img src={icon} alt="" style={{ width: 16, height: 16 }} />}
          <span
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: "#1e293b",
            }}
          >
            {title}
          </span>
        </div>

        {/* Right side: Node actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Minimize / Maximize button */}
          <img
            src={isMinimized ? maximizeIcon : minimizeIcon}
            alt={isMinimized ? "Maximize Node" : "Minimize Node"}
            title={isMinimized ? "Maximize Node" : "Minimize Node"}
            style={{
              width: 14,
              height: 14,
              cursor: "pointer",
              opacity: 0.6,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.6)}
            onClick={toggleMinimize}
          />

          {/* Placeholder for future settings */}
          <span
            style={{
              cursor: "pointer",
              fontSize: 12,
              color: "#64748b",
            }}
          >
            ⚙
          </span>

          {/* Delete button */}
          <span
            title="Delete Node"
            style={{
              cursor: "pointer",
              fontSize: 16,
              color: "#64748b",
              fontWeight: "bold",
              transition: "color 0.2s",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.target.style.color = "#ef4444")}
            onMouseLeave={(e) => (e.target.style.color = "#64748b")}
            onClick={handleDeleteClick}
          >
            ×
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          Delete Confirmation Dialog
          - Prevents accidental node deletion
          - UX safety feature (extra beyond assignment requirements)
         --------------------------------------------------------------------- */}
      {showDeleteDialog && (
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 8,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            padding: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            width: 180,
          }}
        >
          <div
            style={{
              fontSize: 13,
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            Confirm Deletion?
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleCancelDelete}
              style={{
                padding: "4px 8px",
                fontSize: 12,
                cursor: "pointer",
                border: "none",
                background: "transparent",
                color: "#64748b",
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
              style={{
                padding: "4px 8px",
                fontSize: 12,
                cursor: "pointer",
                border: "none",
                background: "#ef4444",
                color: "#fff",
                borderRadius: 4,
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          Node Content Area
          - Hidden when node is minimized
          - Actual node-specific UI is injected via children
         --------------------------------------------------------------------- */}
      {!isMinimized && <div style={{ padding: 14 }}>{children}</div>}

      {/* ---------------------------------------------------------------------
          Handles
          - Always rendered even when node is minimized
          - Ensures graph connectivity is preserved
         --------------------------------------------------------------------- */}
      {handles}
    </div>
  );
};
