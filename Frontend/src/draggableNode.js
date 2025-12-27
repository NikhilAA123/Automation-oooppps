// draggableNode.js
// -----------------------------------------------------------------------------
// Commit: Built reusable draggable component for the node library.
// Purpose: 
// - Encapsulates the native HTML5 Drag and Drop logic for React Flow.
// - Provides a consistent UI for all node types in the sidebar/toolbar.
// - Supports both image-based and emoji-based icons for varied node types.
// - Includes hover and grab interaction states for better tactile feedback.
// -----------------------------------------------------------------------------

/**
 * DraggableNode Component
 * A wrapper for any node type that allows it to be dragged from the toolbar onto the canvas.
 */
export const DraggableNode = ({ type, label, icon, onClick }) => {
  /**
   * onDragStart
   * Serializes the node type into the drag event's dataTransfer object.
   * This is read by the destination (PipelineUI) during the 'drop' event.
   */
  const onDragStart = (event) => {
    // Send data as JSON object with nodeType key (expected by ui.js onDrop)
    event.dataTransfer.setData("application/reactflow", JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = "move";
  };

  // Helper: Detects if the icon is a simple emoji string or a path to an asset
  const isEmoji = typeof icon === 'string' && icon.length <= 2;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      style={{
        padding: "10px 8px",
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        background: "#fff",
        cursor: "grab",
        fontSize: 12,
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        transition: "all 0.15s",
        minHeight: 36,
      }}
      // Visual feedback on hover
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f8fafc";
        e.currentTarget.style.borderColor = "#6366f1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#fff";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      {/* Icon rendering logic */}
      {icon && (
        isEmoji ? (
          <span style={{ fontSize: 14 }}>{icon}</span>
        ) : (
          <img src={icon} alt="" style={{ width: 16, height: 16 }} />
        )
      )}
      {/* Node Label */}
      <span>{label}</span>
    </div>
  );
};

