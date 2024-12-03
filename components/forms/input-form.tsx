/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getHtml } from "@/actions/getTheHtml";
import { GptScrapper } from "@/lib/gptAnalisysFront";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@radix-ui/react-separator";

// Define the form schema using Zod
const formSchema = z.object({
  url: z.string().min(10, {
    message: "Please provide a valid URL.",
  }),
});

// **New Zod Schemas for Combobox and Textarea**
const scopeSchema = z.enum(
  ["Personal", "Business", "Learning", "Testing", "Playing", "Research"],
  {
    errorMap: () => ({ message: "Please select the scope of the above chat." }),
  }
);

const descriptionSchema = z
  .string()
  .min(5, { message: "Description must be at least 5 characters long." })
  .max(200, { message: "Description must be at most 200 characters long." })
  .regex(/^[A-Za-z0-9.,\s]+$/, {
    message:
      "Description can only contain letters, numbers, periods, and commas.",
  });

// Define the component props
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

  // **New State Variables for Combobox and Textarea**
  const [chatScope, setChatScope] = useState<string>("");
  const [chatDescription, setChatDescription] = useState<string>("");

  // **State Variables for Validation Errors**
  const [scopeError, setScopeError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  const [info, setInfo] = useState<{
    scopus: string;
    description: string;
    consent: boolean;
  }>({
    scopus: "",
    description: "",
    consent: true,
  });
  const setChatInfo = useUserStore((state) => state.saveChatInfo);

  // **Popover Open State**
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

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

  // Initialize the workers
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
          // Handle progress update if needed
          // setProgress(prog);
        } else if (success) {
          // Handle final processed messages if needed
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

  // Setup the form
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
            keepText: info.consent,
          });
        } catch (err) {
          worker.removeEventListener("message", handleMessage);
          reject(err);
        }
      }
    );
  };

  /**
   * Check if it is a valid ChatGPT share URL
   * @param url string
   * @returns true/false
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
      onError?.("Invalid ChatGPT share URL");
      return;
    }

    onReset?.();

    /** Update state */
    setChatInfo(info);

    // Return results
    console.log("info", info);

    try {
      showStatus(appIcons.book, "Reading Page...", true, progress);
      // 1. Get HTML
      const result = await getHtml({ url: values.url });
      if (!result.success || !result.chatData) {
        onError?.("Failed to fetch content from the server");
        return;
      }
      const fetchedContent = result.chatData;

      // 2. Create JSON
      showStatus(appIcons.SlMagnifier, "Analyzing Chat...", true, progress);
      const dataJson = await analize.current.createJSON({
        processResult: fetchedContent,
      });

      if (dataJson.status === false) {
        onError?.(dataJson.error as string);
        return;
      }

      // 3. Tokenize messages using the worker
      showStatus(appIcons.encrypt, "Encrypting Content...", true, progress);

      const tokenized = await findParts({
        length: true,
        dataJson,
      });
      if (!tokenized.status) {
        onError?.("Failed to tokenize messages: " + tokenized.error);
        return;
      }

      // 4. Organize JSON
      showStatus(appIcons.report, "Creating Report...", true, progress);
      const organizedResult = await analize.current.orginizeJSON({
        data: JSON.stringify(tokenized.data),
        minimize: false,
        session: dataJson.session as string,
      });

      const { status: orgStatus, data, error } = organizedResult;
      if (orgStatus == false) {
        onError?.(error as string);
      }

      hideStatus();
      onResult(JSON.parse(data as string));
    } catch (error) {
      console.error("Error during submission:", error);
      onError?.("Unexpected error occurred");
    }
  }

  // **Helper Functions for Validation**

  const validateScope = (scope: string): boolean => {
    try {
      scopeSchema.parse(scope);
      setScopeError("");
      setInfo({ ...info, scopus: scope });
      return true;
    } catch (err: any) {
      setScopeError(err.errors[0].message);
      return false;
    }
  };

  const validateDescription = (description: string): boolean => {
    try {
      descriptionSchema.parse(description);
      setDescriptionError("");
      setInfo({ ...info, description: description });
      return true;
    } catch (err: any) {
      setDescriptionError(err.errors[0].message);
      return false;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto flex items-start gap-2 mt-28 lg:mt-20">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            className ? className : "",
            "justify-center flex-col items-center gap-3",
            initiallised ? "flex" : "hidden"
          )}
        >
          {/* Title */}
          <div className="bg-gradient-to-br from-slate-300 to-green-500 bg-clip-text text-center text-xl lg:text-4xl font-medium tracking-tight text-transparent">
            Add a shareable link of ChatGPT
          </div>

          {/* Instructions on how to share a URL */}
          <div className="text-sm mb-7 bg-gradient-to-br from-foreground/60 to-foreground bg-clip-text select-none">
            {"If you don't know how to share a link of ChatGPT "}
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
                    <div className="flex flex-col gap-2 w-full">
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
                        <span className="p-2 border-1 rounded-xl bg-foreground text-background">
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
          <Separator className="w-full px-5 bg-muted-foreground" />

          {/**
           * FORM DATA
           */}
          <div className="w-11/12 lg:w-[500px] flex flex-col justify-start items-center gap-4">
            {/**
             * STEP 1
             */}
            <div className="w-full flex flex-col justify-center items-center gap-2">
              {/* Step number */}
              <div className="w-full flex justify-start items-start gap-2">
                {/* Step number */}
                <div className="w-6 h-6 rounded-full flex aspect-square justify-center items-center bg-background border-2 border-green-500">
                  <p className="text-md text-foreground font-semibold">1</p>
                </div>
                {/* Titles */}
                <h2 className="text-md font-semibold text-green-200">
                  Place here the shared link of your ChatGPT conversation
                </h2>
              </div>

              {/* Input field */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "max-w-[500px] md:w-10/12",
                      status.show ? "opacity-20" : "opacity-100"
                    )}
                  >
                    <FormControl>
                      <Input
                        placeholder="https://chatgpt.com/share/..."
                        {...field}
                        className="active:border-2  rounded-lg  border-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Step 2: Add Scope */}
            <div className="w-full flex flex-col justify-start items-center gap-2">
              {/* Step number */}
              <div className="w-full flex justify-start items-start gap-2">
                {/* Step number */}
                <div className="w-6 h-6 rounded-full flex aspect-square justify-center items-center bg-background border-2 border-green-500">
                  <p className="text-md text-foreground font-semibold">2</p>
                </div>
                {/* Titles */}
                <h2 className="text-md font-semibold text-green-200">
                  When you used this chat, what was the purpose of it?
                </h2>
              </div>

              {/* Combobox Field */}
              <div className="max-w-[500px] md:w-10/12 w-10/12">
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={popoverOpen}
                      className="w-full justify-between border-2 text-foreground"
                    >
                      {chatScope ? chatScope : "Select scope..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="max-w-[250px] lg:max-w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search scope..." />
                      <CommandList className="w-full">
                        <CommandEmpty>No scope found.</CommandEmpty>
                        <CommandGroup>
                          {[
                            "Personal",
                            "Business",
                            "Learning",
                            "Testing",
                            "Playing",
                            "Research",
                          ].map((scopeOption) => (
                            <CommandItem
                              key={scopeOption}
                              value={scopeOption}
                              onSelect={(currentValue) => {
                                setChatScope(
                                  currentValue === chatScope ? "" : currentValue
                                );
                                validateScope(currentValue);
                                setPopoverOpen(false); // Close the Popover after selection
                              }}
                            >
                              {scopeOption}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  chatScope === scopeOption
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {scopeError && (
                  <p className="text-red-500 text-sm mt-1">{scopeError}</p>
                )}
              </div>
            </div>

            {/* Step 3: Add Description */}
            <div className="w-full flex flex-col justify-start items-center gap-2">
              {/* Step number */}
              <div className="w-full flex justify-start items-start gap-2">
                {/* Step number */}
                <div className="w-6 h-6 rounded-full flex aspect-square justify-center items-center bg-background border-2 border-green-500">
                  <p className="text-md text-foreground font-semibold">3</p>
                </div>
                {/* Titles */}
                <h2 className="text-md font-semibold text-green-200">
                  Give a short description of why you made this conversation
                </h2>
              </div>

              {/* Textarea Field */}
              <div className="max-w-[500px] md:w-10/12 w-10/12">
                <Textarea
                  id="chatDescription"
                  value={chatDescription}
                  onChange={(e) => setChatDescription(e.target.value)}
                  onBlur={() => {
                    validateDescription(chatDescription);
                  }}
                  placeholder="This chat with GPT was about ...."
                  rows={3}
                  className="resize-none w-full border-[1px] "
                />
                {descriptionError && (
                  <p className="text-red-500 text-sm mt-1">
                    {descriptionError}
                  </p>
                )}
              </div>
            </div>

            {/* Step 4: Add Consent */}
            <div className="w-full flex flex-col justify-start items-center gap-2">
              {/* Step number */}
              <div className="w-full flex justify-start items-start gap-2">
                {/* Step number */}
                <div className="w-6 h-6 rounded-full flex aspect-square justify-center items-center bg-background border-2 border-green-500">
                  <p className="text-md text-foreground font-semibold">4</p>
                </div>
                {/* Titles */}
                <div className="w-full flex justify-start items-center gap-3">
                  <h2 className="text-md font-semibold text-green-200">
                    Set The -greentext-green-200el of your chat
                  </h2>
                  <Dialog>
                    <DialogTrigger className="text-sm font-semibold text-green-500 animate-pulse">
                      What to choose
                    </DialogTrigger>
                    <DialogContent className="w-11/12 text-sm font-semibold text-foreground">
                      <DialogHeader>
                        <DialogTitle className="w-full text-start">
                          Privacy Level
                        </DialogTitle>
                        <DialogDescription asChild>
                          <div className="w-full">
                            <span className="text-green-500 font-semibold">
                              Access Mode
                            </span>
                            <p>
                              For the purpose of this research, it would be very
                              helpful if we could also read the messages you
                              exchanged with ChatGPT. In this mode, we can
                              access the messages of your conversations to
                              better understand the User - Gpt interaction and
                              evaluation.
                            </p>
                            <span className="text-red-500 font-semibold">
                              Private Mode
                            </span>
                            <p>
                              If this chat contains personal or business
                              information that you do not want to share, please
                              switch to Private mode. In this mode, we will not
                              access the content of your messages. Instead, we
                              will only gather communication patterns and the
                              token length of the messages (tokens lenth is a
                              number showing how long was a message).
                            </p>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              {/* switc */}
              <div className="w-full flex justify-center items-center gap-2">
                <Switch
                  id="consent"
                  checked={info.consent}
                  onCheckedChange={(val) => setInfo({ ...info, consent: val })}
                  className={cn(
                    "border-2 transition-colors relative",
                    info.consent
                      ? "bg-white border-green-500"
                      : "bg-red-500 border-red-500"
                  )}
                  style={
                    {
                      "--switch-thumb-color": info.consent ? "black" : "white", // Dynamically change the thumb color
                    } as React.CSSProperties
                  }
                />

                {/* Dynamic OK or PRIVATE text */}
                <span
                  className={cn(
                    "ml-2 text-sm font-semibold",
                    info.consent ? "text-green-500" : "text-red-500"
                  )}
                >
                  {info.consent ? "ACCESS" : "PRIVATE"}
                </span>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            className="border-2 border-green-500 rounded-lg bg-background text-green-500 hover:bg-foreground/70 hover:text-background mt-6"
            size="lg"
            disabled={status.show}
          >
            <appIcons.analise className="animate-pulse" /> Analyze Chat
          </Button>
        </form>
      </Form>
      {/* Display status */}
      {status.show && (
        <StatusDisplay icon={status.icon} message={status.message} />
      )}
    </div>
  );
};
export default NewUrlForm;
