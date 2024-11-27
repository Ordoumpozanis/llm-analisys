"use server";
import axios, { AxiosResponse } from "axios";
import { JSDOM } from "jsdom";

export async function getHtml({ url }: { url: string }) {
  try {
    console.log(`Fetching HTML content from URL: ${url}`);
    const response: AxiosResponse<string> = await axios.get(url);
    const htmlContent: string = response.data;

    console.log("Parsing HTML content.");
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    console.log("Cleaning up unwanted HTML elements.");
    document
      .querySelectorAll("meta, link, audio")
      .forEach((element) => element.remove());

    const cleanedHTML: string = dom.serialize();
    console.log("HTML content cleaned successfully.");

    return {
      success: true,
      chatData: cleanedHTML, // Return raw HTML content
    };
  } catch (error: any) {
    console.error("Error fetching chat data:", error.message);
    return { success: false, error: error.message };
  }
}
