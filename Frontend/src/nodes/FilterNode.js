// FilterNode.js
// Filter node with icon and handles always visible when minimized.

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import filterIcon from "../assets/filter-icon.png";

export const FilterNode = ({ id, data }) => {
    const [field, setField] = useState(data?.field || "");
    const [operator, setOperator] = useState(data?.operator || "equals");
    const [value, setValue] = useState(data?.value || "");

    const handles = (
        <>
            <Handle type="target" position={Position.Left} id={`${id}-input`} style={{ width: 8, height: 8, background: '#fff', border: '2px solid #6366f1', borderRadius: '50%', left: -4 }} />
            <Handle type="source" position={Position.Right} id={`${id}-output`} style={{ width: 8, height: 8, background: '#fff', border: '2px solid #6366f1', borderRadius: '50%', right: -4 }} />
        </>
    );

    return (
        <BaseNode id={id} title="Filter" icon={filterIcon} handles={handles}>
            {/* Description */}
            <div style={{
                padding: '8px 10px',
                background: '#f8fafc',
                borderRadius: 4,
                marginBottom: 10,
            }}>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                    Filter data based on a condition
                </div>
            </div>

            {/* Field */}
            <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Field ⓘ</span>
                    <span style={{ fontSize: 11, color: '#6366f1' }}>Text</span>
                </div>
                <input
                    type="text"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: 13, color: '#1e293b', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    placeholder="e.g., status"
                />
            </div>

            {/* Operator */}
            <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Operator ⓘ</span>
                    <span style={{ fontSize: 11, color: '#6366f1' }}>Dropdown</span>
                </div>
                <select
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: 13, color: '#1e293b', background: '#fff', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                >
                    <option value="equals">Equals</option>
                    <option value="notEquals">Not Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greaterThan">Greater Than</option>
                    <option value="lessThan">Less Than</option>
                </select>
            </div>

            {/* Value */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Value ⓘ</span>
                    <span style={{ fontSize: 11, color: '#6366f1' }}>Text</span>
                </div>
                <input
                    type="text"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: 13, color: '#1e293b', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="e.g., active"
                />
            </div>
        </BaseNode>
    );
};
