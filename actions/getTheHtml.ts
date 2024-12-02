"use server";
import axios, { AxiosResponse } from "axios";
import { JSDOM } from "jsdom";

export async function getHtml({ url }: { url: string }) {
  try {
    const response: AxiosResponse<string> = await axios.get(url);
    const htmlContent: string = response.data;

    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    document
      .querySelectorAll("meta, link, audio")
      .forEach((element) => element.remove());

    const cleanedHTML: string = dom.serialize();

    return {
      success: true,
      chatData: cleanedHTML, // Return raw HTML content
    };
  } catch (error: any) {
    console.error("Error fetching chat data:", error.message);
    return { success: false, error: error.message };
  }
}
