import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  ReactFlowProvider,
  useReactFlow,
  ConnectionMode,
} from "@xyflow/react";
import { MessageNode, ListNode, WaitNode } from "@/components/FlowEditor/NodeTypes";
import { Sidebar } from "@/components/FlowEditor/Sidebar";
import { PropertiesPanel } from "@/components/FlowEditor/PropertiesPanel";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { useFlowController } from "@/controllers/useFlowController";
import { FlowNodeData } from "@/models/FlowNode";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  message: MessageNode,
  list: ListNode,
  wait: WaitNode,
};

function Flow() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeChange,
    onDeleteNode,
    createNode,
  } = useFlowController();
  
  const [selectedNode, setSelectedNode] = useState<Node<FlowNodeData> | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      createNode(type, position);
    },
    [screenToFlowPosition, createNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<FlowNodeData>) => {
      setSelectedNode(node);
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
        <FloatingActionButton />
      </div>
      <PropertiesPanel
        selectedNode={selectedNode}
        onNodeChange={onNodeChange}
        onDeleteNode={onDeleteNode}
      />
    </div>
  );
}

export default function Index() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}