"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { cn } from "@/lib/utils";

const CustomNode = ({
  className,
  handleTopClassName,
  handleBottomClassName,
  handleLeftClassName,
  handleRightClassName,
  children,
}: {
  className?: string;
  handleTopClassName?: string;
  handleBottomClassName?: string;
  handleLeftClassName?: string;
  handleRightClassName?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center border-2 rounded-md p-3 shadow-md text-sm relative",
        className
          ? className
          : " border-foreground  bg-background text-foreground"
      )}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className={cn("w-3 h-3 bg-gray-700", handleTopClassName)}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={cn("w-3 h-3 bg-gray-700", handleRightClassName)}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className={cn("w-3 h-3 bg-gray-700", handleBottomClassName)}
      />
      <Handle
        type="target"
        position={Position.Left}
        className={cn("w-3 h-3 bg-gray-700", handleLeftClassName)}
      />
      {/* Node content */}
      {children}
    </div>
  );
};

export default CustomNode;
