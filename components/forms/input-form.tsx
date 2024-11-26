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

import { MessagesType, GlobalStatisticsType } from "@/types/chatResults";
import { processChat } from "@/actions/scrap";

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
    messages: MessagesType; // Or use a more specific type like `ChatAnalysis['messages']`
    globalStatistics: GlobalStatisticsType; // Or use a more specific type like `ChatAnalysis['globalStatistics']`
  }) => void;
  onError?: (error: string) => void;
};

const NewUrlForm = ({
  className,
  onResult,
  onReset,
  onError,
  ...props
}: UrlFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    onReset?.();
    try {
      // Call the processChat function
      const result = await processChat({ url: values.url });

      // Handle failure case
      if (!result.success) {
        console.log(
          "Error: I could not fine chat data to analise." + result.error
        );
        onError?.("I could not analise the chat data");
        return;
      }

      // Ensure chatData is present
      if (!result.chatData) {
        console.log(
          "Error: I could not fine chat data to analise." + result.error
        );
        onError?.("I could not analise the chat data");
        return;
      }
      const { messages, globalStatistics } = JSON.parse(result.chatData);
      onResult({ messages, globalStatistics });
    } catch (error) {
      console.error("Could not analisy the chat data:", error);
      onError?.("I could not analise the chat data");
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
