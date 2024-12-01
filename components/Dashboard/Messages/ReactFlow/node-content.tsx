"use client";
import React from "react";
import { IconType } from "react-icons/lib";
import { appIcons } from "@/setup/app-icons";
type Props = {
  data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  Icon: IconType | undefined;
  from: string;
};

function NodeContent({ data, Icon, from, ...props }: Props) {
  return (
    <div
      className="flex flex-col justify-start items-start gap-2 w-fit"
      {...props}
    >
      <div className="flex justify-start items-start gap-2 w-full">
        {Icon && <Icon size={20} />}
        <span className="ml-2">{data.label || { from }}</span>
      </div>
      <div className="text-xs text-green-500 flex gap-2 items-center">
        <appIcons.tokens size={15} />
        {data.message.content.tokens || "N/A"}
        <p className="capitalize animate-pulse">message</p>
      </div>
    </div>
  );
}

export default NodeContent;
