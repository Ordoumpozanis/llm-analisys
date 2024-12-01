"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { GlobalStatisticsType, SessionInfoType } from "@/types/chatResults";
import { ReferenceItemType } from "@/types/chatResults";
import findNearestExample from "@/lib/consumption-examples";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChartLabeled } from "@/components/Dashboard/Charts/pie-chart-labeled";
import { DonutChartCenter } from "@/components/Dashboard//Charts/donut-chart-center";
import { BarChartHor } from "@/components/Dashboard//Charts/bar-chart-hor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ListOfReferences from "@/components/Dashboard/References/references";
import Chatmessages from "@/components/Dashboard/Messages/messages";

type ChartAnalisysProps = {
  className?: string;
  globalStatistics: GlobalStatisticsType;
  sessionInfo: SessionInfoType;
  messages: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  onReset?: () => void;
};

const ChartAnalisys = ({
  className,
  globalStatistics,
  sessionInfo,
  messages,
  ...props
}: ChartAnalisysProps) => {
  const [openChart, setOpenChart] = useState<boolean>(true);

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

  const totalEnergy: number = parseFloat(
    (
      (globalStatistics.questions + globalStatistics.responses) * 0.048 +
      globalStatistics.images * 2.9 +
      globalStatistics.webSearches * 0.3
    ).toFixed(2)
  );

  const energyDescription = findNearestExample(totalEnergy).text;
  const energyImage = findNearestExample(totalEnergy).image;

  const onCardClick = () => {
    setOpenChart(false);
  };
  const references: ReferenceItemType[] = messages[0].references;

  console.log(messages);
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 h-full overflow-hidden p-4 selection: flex-grow max-h-full",
        className
      )}
      {...props}
    >
      {!openChart && (
        <Tabs
          defaultValue="statistics"
          className="w-full flex flex-col justify-start items-center mt-28 lg:mt-2"
        >
          <TabsList className="">
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
          </TabsList>
          <TabsContent value="statistics">
            <div className="w-full flex flex-col justify-center items-center gap-1 flex-wrap mb-4 ">
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
                footer1={
                  <p>
                    `<span className="text-chart-1">You</span> asked $
                    {globalStatistics.questions} questions and{" "}
                    <span className="text-chart-2">LLM</span> needed`
                  </p>
                }
                footer2={
                  <p>{` ${globalStatistics.responses} interactions to answer your questions.`}</p>
                }
                className="w-full md:w-1/4  "
              />

              <DonutChartCenter
                title="LLM Interactions"
                description="Analysis of LLM's Messages"
                data={llmResponceData}
                centerValue={globalStatistics.responses}
                centerLabel={"Messages"}
                footer1={
                  <p>
                    The LLM used {globalStatistics.systemCount}
                    <span className="text-chart-1">System</span> commands,
                  </p>
                }
                footer2={
                  <p>
                    {globalStatistics.assistant}{" "}
                    <span className="text-chart-2">Assistant</span> commands,
                    and {globalStatistics.toolsCalled}{" "}
                    <span className="text-chart-3">Tool</span> usages.
                  </p>
                }
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
                footer1={
                  <p>
                    In this chat, a total of
                    {globalStatistics.systemTokens +
                      globalStatistics.userTokens}{" "}
                    tokens were used.
                  </p>
                }
                footer2={
                  <p>
                    ${globalStatistics.userTokens} from the{" "}
                    <span className="text-chart-1">User</span> and
                    {globalStatistics.systemTokens} from the{" "}
                    <span className="text-chart-2">LLM</span> .
                  </p>
                }
                className="w-full md:w-1/4"
              />
            </div>
            <div className="w-full flex flex-wrap justify-center gap-4">
              {(globalStatistics.images !== 0 ||
                globalStatistics.citations !== 0 ||
                globalStatistics.webSearches !== 0) && (
                <BarChartHor
                  title="Other Elements"
                  description="Additional elements found in the chat"
                  data={otherData}
                  className="w-full lg:w-1/4"
                  footer1={<p>Images created: {globalStatistics.images}</p>}
                  footer2={
                    <p>
                      Web searches made: {globalStatistics.webSearches},
                      Citations used: {globalStatistics.citations}
                    </p>
                  }
                />
              )}

              <DonutChartCenter
                title="Energy Consumption Estimation"
                description="Session's total energy consumption"
                data={EnergyData}
                centerValue={totalEnergy}
                centerLabel={"Energy [Wh]"}
                footer1={`User: ${(0.048 * globalStatistics.questions).toFixed(
                  2
                )} [Wh]`}
                footer2={`LLM: ${(
                  0.048 * globalStatistics.responses +
                  2.9 * globalStatistics.images +
                  0.3 * globalStatistics.webSearches
                ).toFixed(2)} [Wh]`}
                className="w-full lg:w-1/4"
              />
            </div>
          </TabsContent>
          <TabsContent
            value="messages"
            className=" w-full h-full overflow-hidden  "
          >
            <Chatmessages messages={messages} />
          </TabsContent>
          <TabsContent
            value="references"
            className="flex flex-col w-[300px] lg:w-[600px] overflow-hidden justify-center items-start"
          >
            <ListOfReferences
              references={references}
              className=" h-full overflow-y-auto "
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Title Row */}

      {openChart && (
        <Card
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform w-11/12 lg:w-[650px]  border-green-500/50"
          onClick={onCardClick}
        >
          <CardHeader>
            <div className="w-full flex justify-end items-center">
              <button className="rounded-full bg-background text-foreground border-1 p-1 w-fit animate-pulse text-green-500">
                Click to continue
              </button>
            </div>
            <CardTitle className="w-full bg-gradient-to-br from-slate-300 to-green-600 py-4 bg-clip-text text-center text-md md:text-lg lg:text-xl font-medium tracking-tight text-transparent mb-2">
              Undertanding your Energy Consumption Impact
            </CardTitle>
          </CardHeader>

          <CardContent className="w-full">
            <div className="flex gap-2 w-full">
              <div className="w-full md:w-1/2 flex flex-col gap-1">
                {/* title */}
                <div className="text-sm prose dark:prose-invert lg:text-left leading-relaxed w-full mt-5 text-center">
                  The energy spended in this chat was{" "}
                  <span className="text-cyan-500 underline">
                    {totalEnergy} Wh
                  </span>{" "}
                  and is equivalent to{" "}
                </div>
                <div className="w-full bg-gradient-to-br from-slate-300 to-green-600 py-4 bg-clip-text text-center text-md md:text-lg lg:text-xl font-medium tracking-tight text-transparent">
                  {energyDescription}
                </div>
                {/* description */}
                <div className="text-sm prose dark:prose-invert lg:text-left leading-relaxed text-full">
                  {`OpenAI announced that they have reached 200 million active
                  users. If each user sends just one session per day, like the
                  one you're interacting with, the total daily energy
                  consumption would be `}
                </div>
                <div className="w-full bg-gradient-to-br from-slate-300 to-green-600 py-4 bg-clip-text text-center text-md md:text-lg lg:text-xl font-medium tracking-tight text-transparent">
                  {Math.round(totalEnergy * 200)} [GWh]
                </div>
                <div className="text-sm prose dark:prose-invert lg:text-left leading-relaxed">
                  enough to power NEW YORK CITY for{" "}
                </div>
                <div className="w-full bg-gradient-to-br from-slate-300 to-green-600 py-4 bg-clip-text text-center text-md md:text-lg lg:text-xl font-medium tracking-tight text-transparent">
                  {((totalEnergy * 200) / 136).toFixed(2)} days
                </div>
              </div>

              <div
                className="w-2/4 overflow-hidden hidden md:flex bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    energyImage || "/images/consumption/c.webp"
                  })`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChartAnalisys;
