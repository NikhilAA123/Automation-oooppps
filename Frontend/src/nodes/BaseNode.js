// BaseNode.js
// Shared container with light blue header, minimize/maximize, and icon support.
// Handles are always visible even when minimized.

import { useState } from "react";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";

// Import icons
import maximizeIcon from "../assets/maximize-icon.png";
import minimizeIcon from "../assets/minimize-icon.png";

const selector = (state) => ({
  removeNode: state.removeNode,
});

export const BaseNode = ({ id, title, icon, children, handles }) => {
  const { removeNode } = useStore(selector, shallow);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    removeNode(id);
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div style={{
      width: 260,
      background: '#ffffff',
      border: '1px solid #c7d2fe',
      borderRadius: 8,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'visible',
    }}>
      {/* Node Header - Light Blue like VectorShift */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderBottom: isMinimized ? 'none' : '1px solid #c7d2fe',
        background: '#eef2ff',
        borderRadius: isMinimized ? 8 : '8px 8px 0 0',
      }}>
        {/* Left side - Icon and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && (
            <img src={icon} alt="" style={{ width: 16, height: 16 }} />
          )}
          <span style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{title}</span>
        </div>

        {/* Right side - Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Minimize/Maximize Button */}
          <img
            src={isMinimized ? maximizeIcon : minimizeIcon}
            alt={isMinimized ? "Maximize Node" : "Minimize Node"}
            title={isMinimized ? "Maximize Node" : "Minimize Node"}
            style={{
              width: 14,
              height: 14,
              cursor: 'pointer',
              opacity: 0.6,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = 1}
            onMouseLeave={(e) => e.target.style.opacity = 0.6}
            onClick={toggleMinimize}
          />

          {/* Settings Icon */}
          <span style={{ cursor: 'pointer', fontSize: 12, color: '#64748b' }}>⚙</span>

          {/* Delete Button */}
          <span
            title="Delete Node"
            style={{
              cursor: 'pointer',
              fontSize: 16,
              color: '#64748b',
              fontWeight: 'bold',
              transition: 'color 0.2s',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => e.target.style.color = '#ef4444'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
            onClick={handleDeleteClick}
          >
            ×
          </span>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showDeleteDialog && (
        <div style={{
          position: 'absolute',
          top: 40,
          right: 8,
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          padding: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          width: 180,
        }}>
          <div style={{ fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Confirm Deletion?</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              onClick={handleCancelDelete}
              style={{ padding: '4px 8px', fontSize: 12, cursor: 'pointer', border: 'none', background: 'transparent', color: '#64748b' }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              style={{ padding: '4px 8px', fontSize: 12, cursor: 'pointer', border: 'none', background: '#ef4444', color: '#fff', borderRadius: 4 }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Node Content - Hidden when minimized */}
      {!isMinimized && (
        <div style={{ padding: 14 }}>
          {children}
        </div>
      )}

      {/* Handles - Always rendered (passed from node component) */}
      {handles}
    </div>
  );
};
