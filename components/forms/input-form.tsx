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

import React, { useEffect, useState } from "react";
import { getHtml } from "@/actions//getTheHtml";

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
  const [worker, setWorker] = useState<Worker | null>(null);
  // innitialize the workers
  useEffect(() => {
    console.log("Initializing worker...");
    const newWorker = new Worker(
      new URL("../../public/workers/worker.js", import.meta.url)
    );
    setWorker(newWorker);

    return () => {
      // Do not terminate the worker immediately; only when it's no longer needed
      console.log("Worker instance cleanup.");
    };
  }, []);

  // setup the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!worker) {
      console.error("No worker found");
      return;
    }

    onReset?.();

    try {
      const result = await getHtml({ url: values.url });
      if (!result.success || !result.chatData) {
        onError?.("Failed to fetch content from the server");
        return;
      }

      const fetchedContent = result.chatData;

      console.log("Sending to worker...");
      worker.postMessage({ content: fetchedContent });

      worker.onmessage = (e) => {
        const { success, data, error } = e.data;
        if (success) {
          console.log("Received data from worker:", data);
          onResult(data);
        } else {
          onError?.(error || "An error occurred during processing");
        }
      };

      worker.onerror = (err) => {
        console.error("Worker encountered an error:", err);
        onError?.("Worker error");
      };
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
