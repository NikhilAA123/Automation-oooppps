// CustomEdge.js
// -----------------------------------------------------------------------------
// Commit: Enhanced interactive edge component for React Flow.
// Purpose: 
// - Renders a Bézier path representing the connection between nodes.
// - Provides a centered 'delete' button for intuitive connection removal.
// - Integrates with the global Zustand store to manage edge state changes.
// - Includes hover effects for improved user feedback.
// -----------------------------------------------------------------------------

import { getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import { useDispatch } from 'react-redux';
import { onEdgesChange } from './store/nodesSlice';

/**
 * CustomEdge Component
 * An interactive connection line between nodes with a built-in delete action.
 */
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
    // Access dispatch for edge actions
    const dispatch = useDispatch();

    // Calculate the Bézier path and the center position for the label/button
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    /**
     * handleDeleteEdge
     * Triggers the removal of this edge from the React Flow canvas.
     */
    const handleDeleteEdge = () => {
        dispatch(onEdgesChange([{ type: 'remove', id }]));
    };

    return (
        <>
            {/* The actual SVG path of the edge */}
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

            {/* Render a custom label layer for the delete button */}
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all', // Ensure the button is clickable
                    }}
                >
                    {/* Delete button centered on the edge path */}
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

