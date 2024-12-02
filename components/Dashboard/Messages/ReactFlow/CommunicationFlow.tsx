"use client";

import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from "react-flow-renderer";
import UserNode from "@/components/Dashboard/Messages/ReactFlow/nodes//UserNode";
import AssistantNode from "@/components/Dashboard/Messages/ReactFlow/nodes/AssistantNode";
import SystemNode from "@/components/Dashboard/Messages/ReactFlow/nodes/SystemNode";
import ToolNode from "@/components/Dashboard/Messages/ReactFlow/nodes/ToolNode";
import { transformMessageToFlow } from "@/utils/react-flow-message2Flow";
import { cn } from "@/lib/utils";

const nodeTypes = {
  userNode: UserNode,
  assistantNode: AssistantNode,
  systemNode: SystemNode,
  toolNode: ToolNode,
};

interface CommunicationFlowProps {
  message: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  className?: string;
}

const CommunicationFlow: React.FC<CommunicationFlowProps> = ({
  message,
  className,
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const { nodes, edges } = transformMessageToFlow(message);
    setNodes(nodes);
    setEdges(edges);
  }, [message]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, type: "solidEdge" }, eds)), // Default to solidEdge for manual connections
    []
  );

  return (
    <div className={cn(className ? className : "", "w-full h-full ")}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="w-full h-full"
        defaultZoom={0.5}
      >
        <MiniMap />
        <Controls />
        <Background gap={12} size={1} color="#444" />
      </ReactFlow>
    </div>
  );
};

export default CommunicationFlow;
