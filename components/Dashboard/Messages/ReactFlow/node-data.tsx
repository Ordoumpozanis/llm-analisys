"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type Props = {
  data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  className?: string;
};

function NodeData({ data, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "p-4 flex flex-col justify-start items-center w-full",
        className
      )}
      style={{ wordWrap: "break-word" }}
      {...props}
    >
      {Array.isArray(data.message.content.parts) ? (
        <ReactMarkdown className="w-[90%]! h-full!">
          {data?.message?.content?.parts[0] || "No message"}
        </ReactMarkdown>
      ) : (
        "No message"
      )}
    </div>
  );
}

export default NodeData;
