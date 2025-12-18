export const BaseNode = ({ title, children }) => {
  return (
    <div
      style={{
        width: 240,
        background: "var(--bg-node)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-node)",
        borderRadius: 12,
        padding: 12,
        boxShadow: "var(--shadow-node)",
        fontSize: 13,
      }}
    >
      <div
        style={{
          marginBottom: 10,
          fontWeight: 600,
          color: "var(--text-primary)",
          borderBottom: "1px solid var(--border-node)",
          paddingBottom: 6,
        }}
      >
        {title}
      </div>

      <div style={{ color: "var(--text-secondary)" }}>{children}</div>
    </div>
  );
};
