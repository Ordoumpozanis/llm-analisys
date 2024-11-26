"use client";
import React, { useState } from "react";
import NewUrlForm from "../forms/input-form";
import {
  MessagesType,
  GlobalStatisticsType,
  SessionInfoType,
} from "@/types/chatResults";
import { cn } from "@/lib/utils";
import Spinner from "../spinner";
import ChartAnalisys from "./chart-analysis";
import { toast } from "sonner";
import { Toaster } from "../ui/toaster";

interface DashboardProps {
  className?: string;
}

const Dashboard = ({ className, ...props }: DashboardProps) => {
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const [globalStatistics, setGlobalStatistics] =
    useState<GlobalStatisticsType>({
      questions: 0,
      responses: 0,
      toolsCalled: 0,
      assistant: 0,
      systemCount: 0,
      webSearches: 0,
      citations: 0,
      images: 0,
    });
  const [sessionInfo, setSessionInfo] = useState<SessionInfoType>({
    Country: "",
    City: "",
    Title: "",
  });

  const [newSearch, setNewSearch] = useState<boolean>(true);

  const [loading, setLoading] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const handleOnReset = () => {
    console.log("Resetting...");
    setMessages([]);
    setGlobalStatistics({
      questions: 0,
      responses: 0,
      toolsCalled: 0,
      assistant: 0,
      systemCount: 0,
      webSearches: 0,
      citations: 0,
      images: 0,
    });

    setSessionInfo({
      Country: "",
      City: "",
      Title: "",
    });

    setNewSearch(true);
    setLoading({ show: false, message: "" });
  };

  const handleOnError = (error: string) => {
    toast.error(error);
    handleOnReset();
  };

  return (
    <>
      <div
        className={cn(
          "w-full h-full flex flex-col justify-center items-center gap-2",
          className
        )}
        {...props}
      >
        {/* Input Form */}
        {newSearch && !loading.show && (
          <NewUrlForm
            className="w-full"
            onReset={() => {
              setLoading({ show: true, message: "Loading..." });
              setNewSearch(false);

              setMessages([]);
              setGlobalStatistics({
                questions: 0,
                responses: 0,
                toolsCalled: 0,
                assistant: 0,
                systemCount: 0,
                webSearches: 0,
                citations: 0,
                images: 0,
              });
            }}
            onResult={({ messages, globalStatistics, sessionInfo }) => {
              if (!messages || !globalStatistics) {
                toast.error("Error: I could not fine chat data to analise.");
                return;
              }

              setMessages(Array.isArray(messages) ? messages : [messages]);
              setGlobalStatistics(globalStatistics);

              setSessionInfo(sessionInfo);

              setNewSearch(false);
              setLoading({ show: false, message: "" });
            }}
            onError={handleOnError}
          />
        )}
        {!newSearch && !loading.show && (
          <ChartAnalisys
            globalStatistics={globalStatistics}
            sessionInfo={sessionInfo}
            onReset={handleOnReset}
          />
        )}
        {loading.show && (
          <Spinner
            className=" w-fit h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            message={loading.message}
          />
        )}
        <Toaster />
      </div>
    </>
  );
};

export default Dashboard;
