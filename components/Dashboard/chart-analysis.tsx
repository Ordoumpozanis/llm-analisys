import React from "react";
import { GlobalStatisticsType } from "@/types/chatResults";
import { cn } from "@/lib/utils";
import ColorLetters from "./color-letters";
import { Button } from "../ui/button";

type ChartAnalisysProps = {
  className?: string;
  globalStatistics: GlobalStatisticsType;
  onReset: () => void;
};

const ChartAnalisys = ({
  className,
  globalStatistics,
  onReset,
  ...props
}: ChartAnalisysProps) => {
  const handleOnReset = () => {
    onReset();
  };

  return (
    <div
      className={cn("flex flex-col gap-4 justify-end items-center", className)}
      {...props}
    >
      <ColorLetters
        globalStatistics={globalStatistics}
        className="w-6/12"
        onReset={handleOnReset}
      />
    </div>
  );
};

export default ChartAnalisys;
