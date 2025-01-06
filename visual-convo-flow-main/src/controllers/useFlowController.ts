import { useCallback } from "react";
import { Connection, Edge, Node, useNodesState, useEdgesState, addEdge } from "@xyflow/react";
import { FlowNodeData } from "@/models/FlowNode";

let id = 0;
const getId = () => `node_${id++}`;

export function useFlowController() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeChange = useCallback(
    (nodeId: string, newData: FlowNodeData) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: newData };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const createNode = useCallback(
    (type: string, position: { x: number; y: number }) => {
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeChange,
    onDeleteNode,
    createNode,
  };
}