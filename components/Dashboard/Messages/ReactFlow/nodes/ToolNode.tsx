"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import CustomNode from "./CustomNode";
import { appIcons } from "@/setup/app-icons";
import NodeInfo from "@/components/Dashboard/Messages/ReactFlow/node-info-box";

// eslint-disable-line @typescript-eslint/no-explicit-any

const ToolNode = (props: any) => {
  const { data } = props;

  return (
    <CustomNode
      {...props}
      className="border-2 border-pink-500 rounded-lg bg-background"
      data={{ ...props.data }}
    >
      <NodeInfo data={data} from="Tool" Icon={appIcons.tool} />
    </CustomNode>
  );
};

export default ToolNode;
