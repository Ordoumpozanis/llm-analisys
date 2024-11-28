import React from "react";
import { GlobalStatisticsType, SessionInfoType } from "@/types/chatResults";
import { cn } from "@/lib/utils";
import { PieChartLabeled } from "./Charts/pie-chart-labeled";
import { DonutChartCenter } from "./Charts/donut-chart-center";
import { BarChartHor } from "./Charts/bar-chart-hor";

type ChartAnalisysProps = {
  className?: string;
  globalStatistics: GlobalStatisticsType;
  sessionInfo: SessionInfoType;
  onReset?: () => void;
};

const ChartAnalisys = ({
  className,
  globalStatistics,
  sessionInfo,
  ...props
}: ChartAnalisysProps) => {
  const questionResponceData = [
    {
      name: "User Question",
      value: globalStatistics.questions,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "LLM responces",
      value: globalStatistics.responses,
      color: "hsl(var(--chart-2))",
    },
  ];

  const llmResponceData = [
    {
      name: "System",
      value: globalStatistics.systemCount,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "Assistant",
      value: globalStatistics.assistant,
      color: "hsl(var(--chart-2))",
    },
    {
      name: "Tools",
      value: globalStatistics.toolsCalled,
      color: "hsl(var(--chart-3))",
    },
  ];

  const tokensUsedData = [
    {
      name: "User Tokens",
      value: globalStatistics.userTokens,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "LLM Tokens",
      value: globalStatistics.systemTokens,
      color: "hsl(var(--chart-2))",
    },
  ];

  const otherData = [
    {
      name: "Images",
      value: globalStatistics.images,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "Web Searches",
      value: globalStatistics.webSearches,
      color: "hsl(var(--chart-2))",
    },
    {
      name: "Citations",
      value: globalStatistics.citations,
      color: "hsl(var(--chart-3))",
    },
  ];

  const EnergyData = [
    {
      name: "User",
      value: globalStatistics.questions * 2.9,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "LLM",
      value: globalStatistics.responses * 2.9,
      color: "hsl(var(--chart-2))",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 h-full overflow-y-auto p-4",
        className
      )}
      {...props}
    >
      {/* Title Row */}
      <div className="w-full flex flex-col justify-center items-center gap-1 flex-wrap mb-4">
        <h1 className="text-center text-md lg:text-lg capitalize font-semibold ">
          Title: {sessionInfo.Title}
        </h1>
        <div className="flex ju items-center gap-1">
          {sessionInfo.City && (
            <h3 className="text-center text-sm capitalize font-semibold">
              City: {sessionInfo.City}
            </h3>
          )}
          {sessionInfo.Country && (
            <h1 className="text-center text-sm capitalize font-semibold">
              Country: {sessionInfo.Country}
            </h1>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="w-full flex flex-wrap justify-center gap-4">
        <PieChartLabeled
          title="Total Chat Interactions"
          description="Comparison of User Questions and LLM responses"
          data={questionResponceData}
          footer1={`You asked ${globalStatistics.questions} questions and LLM needed`}
          footer2={` ${globalStatistics.responses} interactions to answer your questions.`}
          className="w-full md:w-1/4  "
        />

        <DonutChartCenter
          title="LLM Interactions"
          description="Analysis of LLM's Messages"
          data={llmResponceData}
          centerValue={globalStatistics.responses}
          centerLabel={"Messages"}
          footer1={`The LLM used ${globalStatistics.systemCount} system commands,`}
          footer2={` ${globalStatistics.assistant} assistant commands, and ${globalStatistics.toolsCalled} tool usages.`}
          className="w-full md:w-1/4"
        />

        <DonutChartCenter
          title="Tokens Used"
          description="The number of total tokens used"
          data={tokensUsedData}
          centerValue={Math.floor(
            globalStatistics.systemTokens + globalStatistics.userTokens
          )}
          centerLabel={"Tokens"}
          footer1={`In this chat, a total of ${
            globalStatistics.systemTokens + globalStatistics.userTokens
          } tokens were used.`}
          footer2={`${globalStatistics.userTokens} from the User and ${globalStatistics.systemTokens} from the LLM.`}
          className="w-full md:w-1/4"
        />
      </div>

      <div className="w-full flex flex-wrap justify-center gap-4">
        <BarChartHor
          title="Other Elements"
          description="Additional elements found in the chat"
          data={otherData}
          className="w-full lg:w-1/4"
          footer1={`Images created: ${globalStatistics.images}`}
          footer2={`Web searches made: ${globalStatistics.webSearches}, Citations used: ${globalStatistics.citations}`}
        />

        <DonutChartCenter
          title="Power Consumption Estimation"
          description="Session's total energy consumption"
          data={EnergyData}
          centerValue={
            (globalStatistics.questions + globalStatistics.responses) * 2.9
          }
          centerLabel={"Energy [Wh]"}
          footer1={`User's messages: ${Math.floor(
            2.9 * globalStatistics.questions
          )} [Wh]`}
          footer2={`LLM's messages: ${Math.floor(
            2.9 * globalStatistics.responses
          )} [Wh]`}
          className="w-full lg:w-1/4"
        />
      </div>
    </div>
  );
};

export default ChartAnalisys;
