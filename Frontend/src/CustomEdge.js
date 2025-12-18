// CustomEdge.js
// Custom edge component with a delete button in the middle.

import { getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
    edges: state.edges,
    onEdgesChange: state.onEdgesChange,
});

export const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}) => {
    const { onEdgesChange } = useStore(selector, shallow);

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const handleDeleteEdge = () => {
        onEdgesChange([{ type: 'remove', id }]);
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                >
                    <button
                        onClick={handleDeleteEdge}
                        title="Delete Connection"
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#64748b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 'bold',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#ef4444';
                            e.target.style.color = '#fff';
                            e.target.style.borderColor = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#ffffff';
                            e.target.style.color = '#64748b';
                            e.target.style.borderColor = '#e2e8f0';
                        }}
                    >
                        ×
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
};
