// draggableNode.js
// Toolbar node button with uniform sizing matching VectorShift design.

export const DraggableNode = ({ type, label, icon, onClick }) => {
  const onDragStart = (event) => {
    // Send data as JSON object with nodeType key (expected by ui.js onDrop)
    event.dataTransfer.setData("application/reactflow", JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = "move";
  };

  // Check if icon is emoji (short string) or image path
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
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f8fafc";
        e.currentTarget.style.borderColor = "#6366f1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#fff";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      {/* Icon */}
      {icon && (
        isEmoji ? (
          <span style={{ fontSize: 14 }}>{icon}</span>
        ) : (
          <img src={icon} alt="" style={{ width: 16, height: 16 }} />
        )
      )}
      {/* Label */}
      <span>{label}</span>
    </div>
  );
};
