// app/actions.js
"use server";
import { GptScrapper } from "@/lib/gptAnalisys";

const scrap = new GptScrapper();

type processChatType = {
  url: string;
};

type processChatReturn = {
  success: boolean;
  chatData?: string;
  error?: string;
};

export async function processChat({
  url,
}: processChatType): Promise<processChatReturn> {
  try {
    const result = await scrap.readChat({ url });

    if (result.success) {
      console.log("Chat processing completed successfully.");

      return {
        success: true,
        chatData: result.data,
      };
    } else {
      console.error(`Chat processing failed: ${result.error}`);
      return {
        success: false,
        error: result.error,
      };
    }
  } catch (error: unknown) {
    console.error("Error processing chat:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
