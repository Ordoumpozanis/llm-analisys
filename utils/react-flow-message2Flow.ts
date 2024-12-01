// utils/helper.ts
import { Node, Edge } from "react-flow-renderer";

interface User {
  id: string;
  create_time: number;
  status: string;
  // other properties...
  author: {
    role: string;
    metadata: Record<string, any>;
  };
  content: {
    content_type: string;
    parts: string[];
  };
}

interface Response {
  id: string;
  create_time: number;
  status: string;
  author: {
    role: string;
    name?: string;
    metadata: Record<string, any>;
  };
  content: {
    content_type: string;
    parts: string[];
  };
  metadata: Record<string, any>;
  recipient: string;
  weight: number;
}

interface Message {
  user: User;
  response: Response[];
  statistics: Record<string, any>;
  references: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const transformMessageToFlow = (
  message: Message
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let positionX = 0;
  const positionY = 0;
  const horizontalSpacing = 200;

  // Add User Node
  nodes.push({
    id: message.user.id,
    type: "userNode",
    data: {
      label: "User",
      icon: "U",
      message: message.user,
    },
    position: { x: positionX, y: positionY },
  });

  let previousNodeId = message.user.id; // The user node is the starting point
  positionX += horizontalSpacing;

  // Add Response Nodes and Connect Edges
  message.response.forEach((resp, index) => {
    const nodeType =
      resp.author.role === "tool"
        ? "toolNode"
        : resp.author.role === "assistant"
        ? "assistantNode"
        : "systemNode"; // Default to systemNode if no match

    // Add a response node (duplicates allowed)
    nodes.push({
      id: `${resp.id}-${index}`, // Make each instance unique
      type: nodeType,
      data: {
        label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
        message: resp,
      },
      position: { x: positionX, y: positionY },
    });

    // Add Edge from previous node to this response
    edges.push({
      id: `e-${previousNodeId}-${resp.id}-${index}`, // Unique edge ID
      source: previousNodeId,
      target: `${resp.id}-${index}`, // Match node's unique ID
      type: "smoothstep",
      animated: true,
    });

    // Update for next iteration
    previousNodeId = `${resp.id}-${index}`;
    positionX += horizontalSpacing;
  });

  if (edges.length === 1) {
    edges[0].animated = false;
  } else if (edges.length > 2) {
    edges[0].animated = false;
    edges[edges.length - 1].animated = false;
  }
  return { nodes, edges };
};
