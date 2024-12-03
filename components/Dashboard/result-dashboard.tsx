"use client";
import React, { useState, useEffect } from "react";
import NewUrlForm from "../forms/input-form";
import {
  // MessagesType,
  GlobalStatisticsType,
  SessionInfoType,
} from "@/types/chatResults";
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";
import ChartAnalisys from "./chart-analysis";
import { toast } from "sonner";
import { Toaster } from "../ui/toaster";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { v4 as uuidv4 } from "uuid";
import saveChat from "@/actions/saveResponse";
interface DashboardProps {
  className?: string;
}

const Dashboard = ({ className, ...props }: DashboardProps) => {
  // const [messages, setMessages] = useState<MessagesType[]>([]);
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
      userTokens: 0,
      systemTokens: 0,
    });
  const [sessionInfo, setSessionInfo] = useState<SessionInfoType>({
    Country: "",
    City: "",
    Title: "",
  });
  // eslint-disable-line @typescript-eslint/no-explicit-any

  const [messages, setMessages] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any

  const [newSearch, setNewSearch] = useState<boolean>(true);

  const [loading, setLoading] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const userData = useUserStore((state) => state.userData);
  const setUuid = useUserStore((state) => state.setUuid);
  const uuid = useUserStore((state) => state.uuid);

  const analysed = useUserStore((state) => state.analysed);
  const setAnalysed = useUserStore((state) => state.setAnalysed);
  const chatInfo = useUserStore((state) => state.chatInfo);
  const router = useRouter();

  useEffect(() => {
    if (analysed) {
      router.push("/");
    }
  }, []);

  const handleOnReset = () => {
    // setMessages([]);
    setGlobalStatistics({
      questions: 0,
      responses: 0,
      toolsCalled: 0,
      assistant: 0,
      systemCount: 0,
      webSearches: 0,
      citations: 0,
      images: 0,
      userTokens: 0,
      systemTokens: 0,
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
          "w-full h-full flex flex-col justify-center items-center gap-2 overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Input Form */}
        {newSearch && !loading.show && (
          <NewUrlForm
            className="w-full"
            onReset={() => {
              // setLoading({ show: true, message: "Loading..." });
              // setNewSearch(false);

              // setMessages([]);
              setGlobalStatistics({
                questions: 0,
                responses: 0,
                toolsCalled: 0,
                assistant: 0,
                systemCount: 0,
                webSearches: 0,
                citations: 0,
                images: 0,
                userTokens: 0,
                systemTokens: 0,
              });

              setMessages([]);
            }}
            onResult={async (data) => {
              const { messages, globalStatistics, sessionInfo } = data;

              if (!messages || !globalStatistics) {
                toast.error("Error: I could not fine chat data to analise.");
                return;
              }

              // setMessages(Array.isArray(messages) ? messages : [messages]);
              setGlobalStatistics(globalStatistics);
              setSessionInfo(sessionInfo);
              setMessages(messages);

              const newUuid = uuidv4();
              if (!uuid) {
                setUuid(newUuid);
              }
              const updatedSessionInfo = { ...sessionInfo, ...chatInfo };
              console.log("updatedSessionInfo", updatedSessionInfo);
              // create finale object
              const toSave = {
                messages: messages,
                globalStatistics: globalStatistics,
                sessionInfo: updatedSessionInfo,
                userData: { ...userData },
                type: "General",
                date: new Date().toISOString(),
                uuid: uuid || newUuid,
              };

              setNewSearch(false);
              setLoading({ show: false, message: "" });

              //update state
              setAnalysed(true);

              if (!toSave.uuid) {
                console.error("UUID is missing before saving", toSave);
                toast.error("Error: UUID could not be generated.");
                return;
              }

              //save chat
              await saveChat(JSON.stringify(toSave));
            }}
            onError={handleOnError}
          />
        )}
        {!newSearch && !loading.show && (
          <ChartAnalisys
            globalStatistics={globalStatistics}
            messages={messages}
            sessionInfo={sessionInfo}
            onReset={handleOnReset}
            className="w-full overflow-y-auto"
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
