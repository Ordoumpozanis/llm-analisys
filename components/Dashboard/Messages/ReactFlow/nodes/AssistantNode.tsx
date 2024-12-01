"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import CustomNode from "./CustomNode";
import { appIcons } from "@/setup/app-icons";
import NodeInfo from "@/components/Dashboard/Messages/ReactFlow/node-info-box";

// eslint-disable-line @typescript-eslint/no-explicit-any
const AssistantNode = (props: any) => {
  const { data } = props;

  return (
    <CustomNode
      {...props}
      className="border-2 border-yellow-500 bg-background"
      data={{ ...data }}
    >
      <NodeInfo data={data} from="Assistant" Icon={appIcons.assistant} />
    </CustomNode>
  );
};

export default AssistantNode;
