"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import CustomNode from "./CustomNode";
import { appIcons } from "@/setup/app-icons";
import NodeInfo from "@/components/Dashboard/Messages/ReactFlow/node-info-box";

// eslint-disable-line @typescript-eslint/no-explicit-any

const SystemNode = (props: any) => {
  const { data } = props;

  return (
    <CustomNode
      {...props}
      className="border-2 border-green-500 rounded-lg bg-background"
      data={{ ...data }}
    >
      <NodeInfo data={data} from="System" Icon={appIcons.system} />
    </CustomNode>
  );
};

export default SystemNode;
