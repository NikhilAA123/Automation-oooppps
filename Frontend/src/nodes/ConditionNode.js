// ConditionNode.js
// Condition node with icon and handles always visible when minimized.

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import conditionIcon from "../assets/condition-icon.png";

export const ConditionNode = ({ id, data }) => {
    const [conditionType, setConditionType] = useState(data?.conditionType || "boolean");

    const handles = (
        <>
            <Handle type="target" position={Position.Left} id={`${id}-input`} style={{ width: 8, height: 8, background: '#fff', border: '2px solid #6366f1', borderRadius: '50%', left: -4 }} />
            <Handle type="source" position={Position.Right} id={`${id}-output`} style={{ width: 8, height: 8, background: '#fff', border: '2px solid #6366f1', borderRadius: '50%', right: -4 }} />
        </>
    );

    return (
        <BaseNode id={id} title="Condition" icon={conditionIcon} handles={handles}>
            {/* Description */}
            <div style={{
                padding: '8px 10px',
                background: '#f8fafc',
                borderRadius: 4,
                marginBottom: 10,
            }}>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                    Route data based on a condition
                </div>
            </div>

            {/* Condition Type */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Condition Type ⓘ</span>
                    <span style={{ fontSize: 11, color: '#6366f1' }}>Dropdown</span>
                </div>
                <select
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: 13, color: '#1e293b', background: '#fff', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                    value={conditionType}
                    onChange={(e) => setConditionType(e.target.value)}
                >
                    <option value="boolean">Boolean Check</option>
                    <option value="exists">Value Exists</option>
                    <option value="empty">Is Empty</option>
                    <option value="expression">Custom Expression</option>
                </select>
            </div>
        </BaseNode>
    );
};
