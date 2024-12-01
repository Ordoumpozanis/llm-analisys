"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  triger: React.ReactNode;
  content: React.ReactNode;
};

function PopOverBox({ triger, content }: Props) {
  return (
    <Popover>
      <PopoverTrigger>{triger}</PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  );
}

export default PopOverBox;
