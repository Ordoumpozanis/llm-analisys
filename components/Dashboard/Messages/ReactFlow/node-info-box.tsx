"use client";
import React from "react";
import DialogBox from "@/components/Boxes/dialog-box";
import NodeContent from "./node-content";
import { IconType } from "react-icons/lib";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

  const copyToClipboard = async () => {
    try {
      const data =
        typeof content === "string"
          ? content
          : Array.isArray(content)
          ? JSON.stringify(content)
          : content && typeof content === "object"
          ? JSON.stringify(content)
          : "";
      await navigator.clipboard.writeText(data);
      toast.success("Content copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy content:", error);
      toast.error("Failed to copy content.");
    }
  };

  return (
    <DialogBox
      className="overflow-hidden"
      trigger={<NodeContent data={data} from={from} Icon={Icon} />} // Fixed typo here
      content={
        typeof content === "string"
          ? content
          : Array.isArray(content)
          ? JSON.stringify(content)
          : content && typeof content === "object"
          ? JSON.stringify(content)
          : ""
      }
      title={`${from} Message`} // Add a title prop if required]
      footerCOntent={
        <Button
          variant="outline"
          className="border-green-500 border-[1px]"
          onClick={copyToClipboard}
        >
          Copy to Clipboard
        </Button>
      }
      {...props}
    />
  );
}

export default NodeInfo;
