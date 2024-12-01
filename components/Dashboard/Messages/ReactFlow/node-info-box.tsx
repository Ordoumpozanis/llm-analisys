"use client";
import React from "react";
import DialogBox from "@/components/Boxes/dialog-box";
import NodeContent from "./node-content";
import { IconType } from "react-icons/lib";

type Props = {
  data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  from: string;
  Icon?: IconType | undefined;
};

function NodeInfo({ data, from, Icon, ...props }: Props) {
  const content =
    (data &&
      data.message &&
      data?.message.content &&
      data?.message.content.parts &&
      data?.message?.content?.parts[0]) ||
    "No message";

  return (
    <DialogBox
      className="overflow-hidden"
      trigger={<NodeContent data={data} from={from} Icon={Icon} />} // Fixed typo here
      content={content as string}
      title={`${from} Message`} // Add a title prop if required
      {...props}
    />
  );
}

export default NodeInfo;
