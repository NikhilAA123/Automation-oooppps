// DelayNode.js
// Delay node with handles always visible when minimized.

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const DelayNode = ({ id, data }) => {
    const [duration, setDuration] = useState(data?.duration || 1000);
    const [unit, setUnit] = useState(data?.unit || "ms");

    const handles = (
        <>
            <Handle type="target" position={Position.Left} id={`${id}-input`} style={{ width: 8, height: 8, background: '#fff', border: '2px solid #6366f1', borderRadius: '50%', left: -4 }} />
            <Handle type="source" position={Position.Right} id={`${id}-output`} style={{ width: 8, height: 8, background: '#fff', border: '2px solid #6366f1', borderRadius: '50%', right: -4 }} />
        </>
    );

    return (
        <BaseNode id={id} title="Delay" handles={handles}>
            {/* Description */}
            <div style={{
                padding: '8px 10px',
                background: '#f8fafc',
                borderRadius: 4,
                marginBottom: 10,
            }}>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                    Add a time delay before next step
                </div>
            </div>

            {/* Duration */}
            <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Duration ⓘ</span>
                    <span style={{ fontSize: 11, color: '#6366f1' }}>Number</span>
                </div>
                <input
                    type="number"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: 13, color: '#1e293b', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="0"
                />
            </div>

            {/* Unit */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Unit ⓘ</span>
                    <span style={{ fontSize: 11, color: '#6366f1' }}>Dropdown</span>
                </div>
                <select
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: 13, color: '#1e293b', background: '#fff', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                >
                    <option value="ms">Milliseconds</option>
                    <option value="s">Seconds</option>
                    <option value="m">Minutes</option>
                </select>
            </div>
        </BaseNode>
    );
};
