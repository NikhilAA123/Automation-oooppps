import { Handle, Position } from 'reactflow';

export const BaseNode = ({ title, children }) => {
  return (
    <div
      style={{
        width: 220,
        minHeight: 80,
        border: '1px solid #444',
        borderRadius: 8,
        padding: 10,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
        {title}
      </div>

      <div>
        {children}
      </div>
    </div>
  );
};
