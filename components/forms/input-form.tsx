/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import React, { useEffect, useState, useRef } from "react";
import { getHtml } from "@/actions//getTheHtml";
import { GptScrapper } from "@/lib/gptAnalisysFront";

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
  const [progress, setProgress] = useState(0);

  // innitialize the workers
  useEffect(() => {
    try {
      if (tokenWorker.current) return;
      console.log("Initializing worker...");
      const worker = new Worker(
        new URL("../../public/workers/token-worker.js", import.meta.url)
      );

      // Handle messages from the worker
      worker.onmessage = (event) => {
        const { progress: prog, success, data, error } = event.data;

        if (prog !== undefined) {
          // Handle progress update
          setProgress(prog);
        } else if (success) {
          // Handle final processed messages
          onResult({
            messages: data, // Adjust according to your data structure
            globalStatistics: {}, // Populate as needed
            sessionInfo: {}, // Populate as needed
          });
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
      console.log("Worker initialized!");

      return () => {
        // Do not terminate the worker immediately; only when it's no longer needed
        console.log("Worker instance cleanup.");
      };
    } catch (error) {
      console.error("Worker initialization failed:", error);
    }
  }, [onResult, onError]);

  useEffect(() => {
    console.log("progress", progress);
  }, [progress]);
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
    dataJson: any;
  }) => {
    return new Promise<{ status: boolean; data?: string; error?: any }>(
      (resolve, reject) => {
        const worker = tokenWorker.current;
        if (!worker) {
          reject(new Error("Worker instance is not available"));
          return;
        }

        // Listen for the final response or error
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
          });
        } catch (err) {
          worker.removeEventListener("message", handleMessage);
          reject(err);
        }
      }
    );
  };

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!tokenWorker.current) {
      console.error("Workers not found");
      return;
    }

    onReset?.();

    try {
      //1. get html
      const result = await getHtml({ url: values.url });
      if (!result.success || !result.chatData) {
        onError?.("Failed to fetch content from the server");
        return;
      }
      const fetchedContent = result.chatData;
      console.log("1. Data fetched");
      // step 2: createJSON
      const dataJson = await analize.current.createJSON({
        processResult: fetchedContent,
      });

      if (dataJson.status === false) {
        onError?.(dataJson.error as string);
        return;
      }
      console.log("2. JSON made");

      // 3. Tokenize messages using the worker
      const tokenized = await findParts({ length: true, dataJson });
      if (!tokenized.status) {
        onError?.("Failed to tokenize messages: " + tokenized.error);
        return;
      }
      console.log("3. Token created");

      // step 4: orginizeJSON
      const oginizedResult = await analize.current.orginizeJSON({
        data: JSON.stringify(tokenized.data),
        minimize: false,
        session: dataJson.session as string,
      });

      const { status, data, error } = oginizedResult;
      if (status == false) {
        onError?.(error as string);
      }

      console.log("4. Statistics created");
      onResult(JSON.parse(data as string));

      // console.log("Sending to worker...");
      // mainWorker.postMessage({ content: fetchedContent });

      // mainWorker.onmessage = (e) => {
      //   const { success, data, error } = e.data;
      //   if (success) {
      //     console.log("Received data from worker:", data);
      //     onResult(data);
      //   } else {
      //     onError?.(error || "An error occurred during processing");
      //   }
      // };

      // mainWorker.onerror = (err) => {
      //   console.error("Worker encountered an error:", err);
      //   onError?.("Worker error");
      // };
    } catch (error) {
      console.error("Error during submission:", error);
      onError?.("Unexpected error occurred");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          className ? className : "",
          "flex justify-center flex-col items-center gap-1"
        )}
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="max-w-[500px] md: w-10/12">
              <FormLabel className="text-gray-500 font-semibold">
                Chat Url
              </FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                Put here the Url of your Conversation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
export default NewUrlForm;
