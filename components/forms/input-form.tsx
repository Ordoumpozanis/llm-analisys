/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getHtml } from "@/actions//getTheHtml";
import { GptScrapper } from "@/lib/gptAnalisysFront";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StatusDisplay } from "../status-display";
import { appIcons } from "@/setup/app-icons";
import { IconType } from "react-icons/lib";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

const formSchema = z.object({
  url: z.string().min(10, {
    message: "I should get a url",
  }),
});

type UrlFormProps = {
  className?: string;
  onReset?: () => void;
  onResult: ({
    messages,
    globalStatistics,
    sessionInfo,
  }: {
    messages: any; // Replace with proper type if available
    globalStatistics: any; // Replace with proper type if available
    sessionInfo: any; // Replace with proper type if available
  }) => void;
  onError?: (error: string) => void;
};

const NewUrlForm = ({
  className,
  onReset,
  onResult,
  onError,
}: UrlFormProps) => {
  const tokenWorker = useRef<Worker | null>(null);
  const analize = useRef<GptScrapper>(new GptScrapper());
  // State to track progress
  const [initiallised, setinitiallised] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<{
    show: boolean;
    message: string;
    icon: IconType | null;
    progress?: number;
    showProgress?: boolean;
  }>({
    show: false,
    message: "",
    icon: null,
    progress: 0,
    showProgress: false,
  });
  // cleanup security data or not
  const userData = useUserStore((state) => state?.userData);

  function hideStatus() {
    setStatus({
      show: false,
      message: "",
      icon: null,
      progress: 0,
      showProgress: false,
    });
  }

  function showStatus(
    icon: IconType,
    message: string,
    showProgress = false,
    progress = 0
  ) {
    setStatus({
      show: true,
      message: message,
      icon: icon,
      progress: progress,
      showProgress: showProgress,
    });
  }

  // innitialize the workers
  useEffect(() => {
    try {
      if (tokenWorker.current) return;
      showStatus(appIcons.settings, "Initializing...");

      const worker = new Worker(
        new URL("../../public/workers/token-worker.js", import.meta.url)
      );

      // Handle messages from the worker
      worker.onmessage = (event) => {
        const { progress: prog, success, error } = event.data;

        if (prog !== undefined) {
          // Handle progress update
          // setProgress(prog);
        } else if (success) {
          // Handle final processed messages
          // onResult({
          //   messages: data, // Adjust according to your data structure
          //   globalStatistics: {}, // Populate as needed
          //   sessionInfo: {}, // Populate as needed
          // });
        } else if (error) {
          // Handle error from worker
          console.error("Worker processing failed:", error);
          onError?.("Worker processing failed: " + error);
        }
      };

      worker.onerror = (error) => {
        console.error("Worker encountered an error:", error);
        onError?.("Worker encountered an error");
      };

      tokenWorker.current = worker;

      setStatus({
        show: false,
        message: "",
        icon: null,
      });
      hideStatus();
      setinitiallised(true);
      return () => {
        // Do not terminate the worker immediately; only when it's no longer needed
      };
    } catch (error) {
      hideStatus();
      setinitiallised(false);
      toast.error("App Setup failed");
      console.error("Worker initialization failed:", error);
    }
  }, [onResult, onError]);

  // setup the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  // Updated findParts function to send array of messages

  const findParts = async ({
    length = true,
    dataJson,
  }: {
    length?: boolean;
    dataJson: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }) => {
    return new Promise<{ status: boolean; data?: string; error?: any }>(
      (resolve, reject) => {
        const worker = tokenWorker.current;
        if (!worker) {
          reject(new Error("Worker instance is not available"));
          return;
        }

        // Listen for the final response or error
        // eslint-disable-line @typescript-eslint/no-explicit-any

        const handleMessage = (event: any) => {
          const { progress: prog, success, data, error } = event.data;

          if (prog !== undefined) {
            // Update progress
            setProgress(prog);
          } else if (success) {
            // Final data received
            worker.removeEventListener("message", handleMessage);
            resolve({ status: true, data });
          } else if (error) {
            // Error from worker
            worker.removeEventListener("message", handleMessage);
            resolve({ status: false, error });
          }
        };

        worker.addEventListener("message", handleMessage);

        // Send the array of messages to the worker
        try {
          const messages = JSON.parse(dataJson.data as string);
          worker.postMessage({
            messages,
            length,
            keepText: userData?.consent ?? false,
          });
        } catch (err) {
          worker.removeEventListener("message", handleMessage);
          reject(err);
        }
      }
    );
  };

  /**
   * check if is a valid chatgpt share url
   * @param url string
   * @returns  true/false
   */
  function isValidChatGptShareUrl(url: string): boolean {
    const regex =
      /^https:\/\/chatgpt\.com\/share\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
    return regex.test(url);
  }

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!tokenWorker.current) {
      console.error("Workers not found");
      return;
    }

    const isValid = isValidChatGptShareUrl(values.url);
    if (!isValid) {
      onError?.("Invalid ChatGPT share url");
      return;
    }

    onReset?.();

    try {
      showStatus(appIcons.book, "Reading Page...", true, progress);
      //1. get html
      const result = await getHtml({ url: values.url });
      if (!result.success || !result.chatData) {
        onError?.("Failed to fetch content from the server");
        return;
      }
      const fetchedContent = result.chatData;

      // step 2: createJSON
      showStatus(appIcons.SlMagnifier, "Analise Chat...", true, progress);
      const dataJson = await analize.current.createJSON({
        processResult: fetchedContent,
      });

      if (dataJson.status === false) {
        onError?.(dataJson.error as string);
        return;
      }

      // 3. Tokenize messages using the worker

      showStatus(appIcons.encrypt, "Encrypt contnet...", true, progress);

      const tokenized = await findParts({
        length: true,
        dataJson,
      });
      if (!tokenized.status) {
        onError?.("Failed to tokenize messages: " + tokenized.error);
        return;
      }

      // step 4: orginizeJSON
      showStatus(appIcons.report, "Creating Report...", true, progress);
      const oginizedResult = await analize.current.orginizeJSON({
        data: JSON.stringify(tokenized.data),
        minimize: false,
        session: dataJson.session as string,
      });

      const { status, data, error } = oginizedResult;
      if (status == false) {
        onError?.(error as string);
      }

      hideStatus();

      // retun results
      onResult(JSON.parse(data as string));
    } catch (error) {
      console.error("Error during submission:", error);
      onError?.("Unexpected error occurred");
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            className ? className : "",
            " justify-center flex-col items-center gap-3",
            initiallised ? "flex" : "hidden"
          )}
        >
          {/* instructions */}
          <div className=" bg-gradient-to-br from-slate-300 to-green-500 bg-clip-text text-center text-xl lg:text-4xl font-medium tracking-tight text-transparent md:text-7xl ">
            Add a shareable link of ChatGpt
          </div>
          <div className=" text-sm mb-7 bg-gradient-to-br from-foreground/60 to-foreground bg-clip-text select-none">
            {"If you don't know how to share a link of ChatGpt "}
            <Dialog>
              <DialogTrigger>
                <span className="capitalize animate-pulse font-bold text-md select-none">
                  click here
                </span>
              </DialogTrigger>
              <DialogContent className="border-2 border-green-500/50">
                <DialogHeader>
                  <DialogTitle>How to make a chat sharable</DialogTitle>
                  <DialogDescription className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2 w-full ">
                      <div>
                        <span className="capitalize font-semibold text-green-500/50">
                          Step 1
                        </span>{" "}
                        press the share button on the top right
                      </div>
                      <div className="w-full flex justify-center items-center rounded-lg overflow-hidden">
                        <Image
                          src="/images/step-1.png"
                          alt="Press the Share button on the top right"
                          width={300}
                          height={300}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <span className="capitalize font-semibold text-green-500/50">
                          Step 2
                        </span>{" "}
                        press the button{" "}
                        <span className="p-2 border-1 rounded-xl bg-foreground text-background ">
                          Create Link
                        </span>{" "}
                        to make the chat sharable
                      </div>
                      <div className="w-full flex justify-center items-center">
                        <Image
                          src="/images/step-2.png"
                          alt="Press the Create Link button"
                          width={300}
                          height={300}
                        />
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          {/* form   */}
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem
                className={cn(
                  "max-w-[500px] md: w-10/12",
                  status.show ? "opacity-20" : "opacity-100"
                )}
              >
                <FormControl>
                  <Input
                    placeholder="shadcn"
                    {...field}
                    className=" active:border-2 active:border-green-500 rounded-lg text-green-500"
                  />
                </FormControl>
                <FormDescription className="text-sm">
                  Put here the Url of your Conversation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="default"
            className="border-2 border-green-500 rounded-lg bg-background text-green-500 hover:bg-foreground/70 hover:text-background"
            size="lg"
            disabled={status.show}
          >
            <appIcons.analise className="animate-pulse" /> Analise Chat
          </Button>
        </form>
      </Form>
      {/* display status */}
      {status.show && (
        <StatusDisplay icon={status.icon} message={status.message} />
      )}
    </>
  );
};
export default NewUrlForm;
