// textNode.js
// -----------------------------------------------------------------------------
// TextNode with Redux-backed text state and dynamic variable handles
// -----------------------------------------------------------------------------

import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { updateNodeField } from "../store/nodesSlice";

export const TextNode = ({ id }) => {
  const dispatch = useDispatch();

  const nodeData = useSelector(
    (state) => state.nodes.nodes.find((node) => node.id === id)?.data
  );

  const text = nodeData?.text || "";

  // ---------------------------------------------------------------------------
  // Extract variables using {{variableName}} syntax
  // ---------------------------------------------------------------------------
  const variables = useMemo(() => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const found = new Set();
    let match;

    while ((match = regex.exec(text))) {
      found.add(match[1]);
    }

    return Array.from(found);
  }, [text]);

  const handleTextChange = (e) => {
    dispatch(
      updateNodeField({
        id,
        field: "text",
        value: e.target.value,
      })
    );
  };

  const handles = (
    <>
      {variables.map((varName, index) => (
        <Handle
          key={`${id}-${varName}`}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{
            top: `${30 + index * 25}%`,
            width: 8,
            height: 8,
            border: "2px solid #6366f1",
            borderRadius: "50%",
            left: -4,
          }}
        />
      ))}

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          width: 8,
          height: 8,
          border: "2px solid #6366f1",
          borderRadius: "50%",
          right: -4,
        }}
      />
    </>
  );

  return (
    <BaseNode id={id} title="Text" handles={handles}>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Use {{variableName}} to create input handles"
        style={{ width: "100%", minHeight: 80 }}
      />

      {variables.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 11 }}>
          <strong>Variables:</strong> {variables.join(", ")}
        </div>
      )}
    </BaseNode>
  );
};
