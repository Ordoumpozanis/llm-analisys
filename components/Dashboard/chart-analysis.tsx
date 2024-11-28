import React from "react";
import { GlobalStatisticsType, SessionInfoType } from "@/types/chatResults";
import { cn } from "@/lib/utils";
import ColorLetters from "./color-letters";

type ChartAnalisysProps = {
  className?: string;
  globalStatistics: GlobalStatisticsType;
  sessionInfo: SessionInfoType;
  onReset: () => void;
};

const ChartAnalisys = ({
  className,
  globalStatistics,
  sessionInfo,
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
        className="w-full md:w-6/12 px-5 md:px-0"
        onReset={handleOnReset}
        sessionInfo={sessionInfo}
      />
    </div>
  );
};

export default ChartAnalisys;
