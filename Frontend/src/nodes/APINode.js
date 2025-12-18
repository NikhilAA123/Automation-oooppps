// APINode.js
// API node with icon and handles always visible when minimized.

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import apiIcon from "../assets/api-icon.png";

export const APINode = ({ id, data }) => {
    const [url, setUrl] = useState(data?.url || "https://api.example.com");
    const [method, setMethod] = useState(data?.method || "GET");

    const handles = (
        <>
            <Handle type="target" position={Position.Left} id={`${id}-input`} style={{ width: 8, height: 8, background: '#fff', border: '2px solid #6366f1', borderRadius: '50%', left: -4 }} />
            <Handle type="source" position={Position.Right} id={`${id}-output`} style={{ width: 8, height: 8, background: '#fff', border: '2px solid #6366f1', borderRadius: '50%', right: -4 }} />
        </>
    );

    return (
        <BaseNode id={id} title="API" icon={apiIcon} handles={handles}>
            {/* Description */}
            <div style={{
                padding: '8px 10px',
                background: '#f8fafc',
                borderRadius: 4,
                marginBottom: 10,
            }}>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                    Make an HTTP request to an external API
                </div>
            </div>

            {/* URL Input */}
            <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>URL ⓘ</span>
                    <span style={{ fontSize: 11, color: '#6366f1' }}>Text</span>
                </div>
                <input
                    type="text"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: 13, color: '#1e293b', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>

            {/* Method Selection */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Method ⓘ</span>
                    <span style={{ fontSize: 11, color: '#6366f1' }}>Dropdown</span>
                </div>
                <select
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: 13, color: '#1e293b', background: '#fff', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
            </div>
        </BaseNode>
    );
};
