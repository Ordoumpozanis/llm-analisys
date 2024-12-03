/* eslint-disable @typescript-eslint/no-explicit-any */

// GptScrapper.ts

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { JSDOM } from "jsdom";
import fs from "fs/promises";
import JSON5 from "json5";

/**
 * Interface representing the result of an operation.
 */
interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Interface for JSON saving parameters.
 */
interface SaveJsonParams {
  data: string;
  filename?: string;
}

/**
 * Interface for message extraction parameters.
 */
interface ExtractMessagesParams {
  json: string;
}

/**
 * Interface for minimizing messages parameters.
 */
interface MinimizeMessagesParams {
  json: string;
  minimized?: boolean;
}

/**
 * Interface for organizing messages parameters.
 */
interface OrganizeMessagesParams {
  messagesJSON: string;
}

/**
 * Interface for statistics and references.
 */
interface StatisticsAndReferences {
  statistics: {
    responses: number;
    toolsCalled: number;
    assistant: number;
    systemCount: number;
    webSearches: number;
    citations: number;
    images: number;
  };
  references: Reference[];
}

/**
 * Interface for references.
 */
interface Reference {
  url: string | null;
  title: string | null;
}

/**
 * Interface for global statistics.
 */
interface GlobalStatistics {
  questions: number;
  responses: number;
  toolsCalled: number;
  assistant: number;
  systemCount: number;
  webSearches: number;
  citations: number;
  images: number;
}

/**
 * Interface for global statistics result.
 */
interface GlobalStatisticsResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[];
  content: string;
}

/**
 * Configuration interface for GptScrapper.
 */
interface GptScrapperConfig {
  htmlFileName?: string;
  outputFile?: string;
  axiosInstance?: AxiosInstance;
}

/**
 * Interface for SessionInfo.
 */
interface SessionInfo {
  Country?: string;
  City?: string;
  Title?: string;
}

/**
 * Class responsible for scraping and processing ChatGPT conversations.
 */
export class GptScrapper {
  private htmlFileName: string;
  private outputFile: string;
  private axios: AxiosInstance;

  /**
   * Initializes a new instance of the GptScrapper class.
   * @param config - Configuration options for GptScrapper.
   */
  constructor(config?: GptScrapperConfig) {
    this.htmlFileName = config?.htmlFileName || "cleaned.html";
    this.outputFile = config?.outputFile || "serverResponse.json";
    this.axios = config?.axiosInstance || axios.create();
  }

  /**
   * Helper method to create an error result.
   * @param message - The error message.
   * @returns An OperationResult object with success=false and the error message.
   */
  private onError<T>(message: string): OperationResult<T> {
    return { success: false, error: message };
  }

  /**
   * Fetches the HTML content from a ChatGPT conversation URL and cleans it.
   * @param url - The GPT chat URL.
   * @returns An object containing the success status and the cleaned HTML content.
   */
  public async processChat(url: string): Promise<OperationResult<string>> {
    try {
      console.log(`Fetching HTML content from URL: ${url}`);
      const response: AxiosResponse<string> = await this.axios.get(url);
      const htmlContent: string = response.data;

      console.log("Parsing HTML content.");
      const dom = new JSDOM(htmlContent);
      const document = dom.window.document;

      console.log("Cleaning up unwanted HTML elements.");
      /* eslint-disable @typescript-eslint/no-explicit-any */
      document
        .querySelectorAll("meta, link, audio")
        .forEach((element: any) => element.remove());

      const cleanedHTML: string = dom.serialize();
      console.log("HTML content cleaned successfully.");

      return { success: true, data: cleanedHTML };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Axios error processing chat: ${error.message}`);
        return this.onError<string>(`Axios error: ${error.message}`);
      } else if (error instanceof Error) {
        console.error(`Error processing chat: ${error.message}`);
        return this.onError<string>(`Error: ${error.message}`);
      } else {
        console.error("Unknown error processing chat.");
        return this.onError<string>("Unknown error processing chat.");
      }
    }
  }

  /**
   * Saves the cleaned HTML content to a specified file.
   * @param filename - The filename to save the cleaned HTML.
   * @param data - The HTML data to save.
   * @returns An object indicating the success status.
   */
  private async saveHtml(
    filename: string,
    data: string
  ): Promise<OperationResult<void>> {
    try {
      console.log(`Saving cleaned HTML to file: ${filename}`);
      await fs.writeFile(filename, data, "utf8");
      console.log(`Cleaned HTML content saved to ${filename}.`);
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error saving HTML: ${error.message}`);
        return this.onError<void>(`Failed to save HTML: ${error.message}`);
      } else {
        console.error("Unknown error saving HTML.");
        return this.onError<void>("Unknown error saving HTML.");
      }
    }
  }

  /**
   * Extracts the server response from the HTML content.
   * @param params - An object containing the HTML content.
   * @returns An object containing the success status and the extracted JSON string.
   */
  private async extractServerResponse(params: {
    content: string;
  }): Promise<OperationResult<string>> {
    try {
      const { content } = params;
      const startKey = "routes/share.$shareId.($action)";
      const startTrim = content.indexOf(startKey);
      if (startTrim === -1) {
        console.warn("Start key not found in content.");
        return this.onError<string>("Start key not found in content.");
      }

      const objectStart = startTrim + startKey.length - 1;
      const endTrimMarker = `actionData`;
      const serverResponseEnd = content.indexOf(endTrimMarker, objectStart);
      if (serverResponseEnd === -1) {
        console.warn("End marker not found in content.");
        return this.onError<string>("End marker not found in content.");
      }

      let extractedBlock = content.substring(
        objectStart,
        serverResponseEnd + 1
      );

      // Clean the extracted block
      extractedBlock = this.cleanExtractedBlock(extractedBlock);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let jsonObject: any;
      try {
        console.log("Parsing extracted block as JSON5.");
        jsonObject = JSON5.parse(extractedBlock);
      } catch (parseError: unknown) {
        if (parseError instanceof Error) {
          console.error(`Error parsing JSON5: ${parseError.message}`);
          return this.onError<string>("JSON5 parsing failed.");
        } else {
          console.error("Unknown error parsing JSON5.");
          return this.onError<string>("Unknown error parsing JSON5.");
        }
      }

      const jsonString: string = JSON.stringify(jsonObject, null, 2);
      console.log("Server response extracted and parsed successfully.");

      return { success: true, data: jsonString };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error extracting server response: ${error.message}`);
        return this.onError<string>(
          `Failed to extract server response: ${error.message}`
        );
      } else {
        console.error("Unknown error extracting server response.");
        return this.onError<string>(
          "Unknown error extracting server response."
        );
      }
    }
  }

  /**
   * Cleans the extracted block by performing slicing and trimming.
   * @param block - The extracted block string.
   * @returns The cleaned block string.
   */
  private cleanExtractedBlock(block: string): string {
    // Perform the same cleaning as in the original code
    return block
      .slice(3)
      .trim()
      .slice(0, -1)
      .trim()
      .slice(0, -1)
      .trim()
      .slice(0, -1)
      .trim()
      .slice(0, -1)
      .trim();
  }

  /**
   * Saves a JSON string to a specified file.
   * @param params - An object containing the JSON data and optional filename.
   * @returns An object indicating the success status.
   */
  private async saveJson(
    params: SaveJsonParams
  ): Promise<OperationResult<void>> {
    const { data, filename = "data.json" } = params;
    try {
      console.log(`Saving JSON data to file: ${filename}`);
      await fs.writeFile(filename, data, "utf8");
      console.log(`JSON content saved to ${filename}.`);
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error saving JSON: ${error.message}`);
        return this.onError<void>(`Failed to save JSON: ${error.message}`);
      } else {
        console.error("Unknown error saving JSON.");
        return this.onError<void>("Unknown error saving JSON.");
      }
    }
  }

  /**
   * Extracts messages from a JSON string by traversing the object and collecting 'message' fields.
   * @param params - An object containing the JSON string.
   * @returns An object containing the success status and the extracted messages as a JSON string.
   */
  private extractMessagesFromJSON(
    params: ExtractMessagesParams
  ): OperationResult<string> {
    const { json } = params;
    let jsonObject: any;

    try {
      jsonObject = JSON.parse(json);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error parsing JSON: ${error.message}`);
        return this.onError<string>("Invalid JSON string.");
      } else {
        console.error("Unknown error parsing JSON.");
        return this.onError<string>("Unknown error parsing JSON.");
      }
    }

    try {
      if (typeof jsonObject !== "object" || jsonObject === null) {
        throw new Error("Invalid JSON object.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const messages: any[] = [];

      /**
       * Recursively traverses the object to collect messages.
       * @param obj - The current object being traversed.
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const traverse = (obj: any): void => {
        if (obj && typeof obj === "object") {
          if ("message" in obj) {
            messages.push(obj.message);
          }

          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              traverse(obj[key]);
            }
          }
        }
      };

      traverse(jsonObject);

      const jsonString: string = JSON.stringify(messages, null, 2);
      console.log("Messages extracted successfully.");

      return { success: true, data: jsonString };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error extracting messages: ${error.message}`);
        return this.onError<string>(
          `Failed to extract messages: ${error.message}`
        );
      } else {
        console.error("Unknown error extracting messages.");
        return this.onError<string>("Unknown error extracting messages.");
      }
    }
  }

  /**
   * Minimizes messages by removing null records and optionally filtering unique messages.
   * @param params - An object containing the JSON string and a flag to minimize.
   * @returns An object containing the success status and the minimized JSON string.
   */
  private minimizeMessagesFromJSON(
    params: MinimizeMessagesParams
  ): OperationResult<string> {
    const { json, minimized = true } = params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let jsonArray: any[];

    try {
      jsonArray = JSON.parse(json);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Invalid input: failed to parse JSON string.");
        return this.onError<string>("Invalid JSON string.");
      } else {
        console.error("Unknown error parsing JSON string.");
        return this.onError<string>("Unknown error parsing JSON string.");
      }
    }

    if (!Array.isArray(jsonArray)) {
      console.error("Invalid input: expected a JSON array.");
      return this.onError<string>("Expected a JSON array.");
    }

    /**
     * Recursively removes null values from an object.
     * @param obj - The object to clean.
     * @returns The cleaned object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeNulls = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(removeNulls);
      } else if (obj && typeof obj === "object") {
        return (
          Object.entries(obj)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, value]) => value !== null)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .reduce((acc: any, [key, value]) => {
              acc[key] = removeNulls(value);
              return acc;
            }, {})
        );
      }
      return obj;
    };

    // Create a Map to filter unique messages by 'create_time'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueMessagesMap: Map<string, any> = new Map();
    jsonArray.forEach((item) => {
      if (item?.create_time) {
        uniqueMessagesMap.set(item.create_time, item);
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueMessages: any[] = Array.from(uniqueMessagesMap.values());

    try {
      if (minimized) {
        const results = uniqueMessages.map((item) =>
          removeNulls({
            role: item?.author?.role || null,
            real_author: item?.author?.metadata?.real_author || null,
            parts: item?.content?.parts || null,
            other: {
              search_result_groups:
                item?.metadata?.search_result_groups || null,
              model_slug: item?.metadata?.model_slug || null,
              image_results: item?.metadata?.image_results || null,
              content_references: item?.metadata?.content_references || null,
              citations: item?.metadata?.citations || null,
            },
          })
        );
        console.log("Messages minimized and cleaned successfully.");
        return { success: true, data: JSON.stringify(results, null, 2) };
      }

      // Option 2: Full content without minimization
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fullContentCleaned: any[] = uniqueMessages.map((item) =>
        removeNulls(item)
      );
      console.log("Messages cleaned successfully without minimization.");
      return {
        success: true,
        data: JSON.stringify(fullContentCleaned, null, 2),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error minimizing messages: ${error.message}`);
        return this.onError<string>(
          `Failed to minimize messages: ${error.message}`
        );
      } else {
        console.error("Unknown error minimizing messages.");
        return this.onError<string>("Unknown error minimizing messages.");
      }
    }
  }

  /**
   * Organizes chat messages into questions and responses with associated statistics.
   * @param params - An object containing the messages in JSON format.
   * @returns An object containing the success status and the organized messages as a JSON string.
   */
  private organizeMessages(
    params: OrganizeMessagesParams
  ): OperationResult<string> {
    const { messagesJSON } = params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsedMessages: any[];

    try {
      parsedMessages = JSON.parse(messagesJSON);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Invalid input: failed to parse JSON string.");
        return this.onError<string>("Invalid JSON string.");
      } else {
        console.error("Unknown error parsing JSON string.");
        return this.onError<string>("Unknown error parsing JSON string.");
      }
    }

    if (!Array.isArray(parsedMessages)) {
      console.error("Invalid input: expected a JSON array.");
      return this.onError<string>("Expected a JSON array.");
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const organizedMessages: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let currentQuestion: any = null;

      parsedMessages.forEach((message) => {
        if (message.author?.role === "user") {
          // Start a new question
          if (currentQuestion) {
            // Add statistics and references to the previous question
            const statsAndRefs: StatisticsAndReferences =
              this.statisticsAndReferences(currentQuestion.response);
            currentQuestion.statistics = statsAndRefs.statistics;
            currentQuestion.references = statsAndRefs.references;

            // Save the previous question and its responses
            organizedMessages.push(currentQuestion);
          }
          // Initialize a new question with the user message
          currentQuestion = { user: message, response: [] };
        } else if (currentQuestion) {
          // Add responses to the current question
          currentQuestion.response.push(message);
        }
      });

      // Add the last question and its responses (if any)
      if (currentQuestion) {
        const statsAndRefs: StatisticsAndReferences =
          this.statisticsAndReferences(currentQuestion.response);
        currentQuestion.statistics = statsAndRefs.statistics;
        currentQuestion.references = statsAndRefs.references;

        organizedMessages.push(currentQuestion);
      }

      console.log("Messages organized successfully.");
      return {
        success: true,
        data: JSON.stringify(organizedMessages, null, 2),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error organizing messages: ${error.message}`);
        return this.onError<string>(
          `Failed to organize messages: ${error.message}`
        );
      } else {
        console.error("Unknown error organizing messages.");
        return this.onError<string>("Unknown error organizing messages.");
      }
    }
  }

  /**
   * Generates statistics and references from a list of responses.
   * @param responses - The responses associated with a user question.
   * @returns An object containing statistics and an array of references.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private statisticsAndReferences(responses: any[]): StatisticsAndReferences {
    let responseCount = 0;
    let toolsCalled = 0;
    let assistantCount = 0;
    let systemCount = 0;
    let webSearches = 0;
    let citationCount = 0;
    let imageCount = 0;
    const references: Reference[] = [];

    responses.forEach((response) => {
      responseCount++;

      if (response.author?.role === "tool") {
        toolsCalled++;
      }

      if (response.author?.role === "assistant") {
        assistantCount++;
      }

      if (response.author?.role === "system") {
        systemCount++;
      }

      // Count valid search_result_groups
      if (Array.isArray(response.metadata?.search_result_groups)) {
        webSearches += response.metadata.search_result_groups.length;

        // Traverse search_result_groups and collect citations with valid titles
        response.metadata.search_result_groups.forEach((group: any) => {
          if (Array.isArray(group.entries)) {
            group.entries.forEach((entry: any) => {
              if (entry?.title && entry.title.trim() !== "") {
                citationCount++;
                references.push({
                  url: entry.url || null,
                  title: entry.title || null,
                });
              }
            });
          }
        });
      }

      // Count image asset pointers
      if (Array.isArray(response.content?.parts)) {
        response.content.parts.forEach((part: any) => {
          if (
            part?.content_type === "image_asset_pointer" &&
            part.asset_pointer
          ) {
            imageCount++;
          }
        });
      }
    });

    return {
      statistics: {
        responses: responseCount,
        toolsCalled: toolsCalled,
        assistant: assistantCount,
        systemCount: systemCount,
        webSearches: webSearches,
        citations: citationCount,
        images: imageCount,
      },
      references,
    };
  }

  /**
   * Calculates global statistics from organized messages.
   * @param params - An object containing the JSON data.
   * @returns An object containing the messages and the global statistics as a JSON string.
   */

  private globalStatistics(params: {
    json: string;
    sessionInfo: SessionInfo;
  }): GlobalStatisticsResult {
    const { json } = params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsedMessages: any[];

    try {
      parsedMessages = typeof json === "string" ? JSON.parse(json) : json;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error("Invalid input: failed to parse JSON string.", error);
    }

    const globalStats: GlobalStatistics = {
      questions: 0,
      responses: 0,
      toolsCalled: 0,
      assistant: 0,
      systemCount: 0,
      webSearches: 0,
      citations: 0,
      images: 0,
    };

    parsedMessages.forEach((entry) => {
      if (entry.user) {
        globalStats.questions++;
      }

      if (entry.statistics) {
        globalStats.responses += entry.statistics.responses || 0;
        globalStats.toolsCalled += entry.statistics.toolsCalled || 0;
        globalStats.assistant += entry.statistics.assistant || 0;
        globalStats.systemCount += entry.statistics.systemCount || 0;
        globalStats.webSearches += entry.statistics.webSearches || 0;
        globalStats.citations += entry.statistics.citations || 0;
        globalStats.images += entry.statistics.images || 0;
      }
    });

    const object = {
      messages: parsedMessages,
      globalStatistics: globalStats,
      sessionInfo: params.sessionInfo,
    };

    return {
      messages: parsedMessages,
      content: JSON.stringify(object, null, 2),
    };
  }

  /**
   * Asynchronously extracts session-related information (Country, City, Title) from a JSON string.
   *
   * @function getSessionInfo
   * @async
   * @param {Object} param - The function parameter object.
   * @param {string} param.json - A JSON string expected to contain `chatPageProps` and `meta` keys.
   * @returns {Promise<SessionInfo>} A Promise that resolves to an object containing the session information,
   * or `null` if parsing or extraction fails.
   */

  getSessionInfo = async ({ json }: { json: any }): Promise<SessionInfo> => {
    try {
      const jsonObject = JSON.parse(json);
      // Validate the parsed object to ensure it's a non-null object
      if (typeof jsonObject !== "object" || jsonObject === null) {
        throw new Error("Invalid input: expected a JSON object.");
      }

      // Safely extract the required values using optional chaining
      const Country = jsonObject.chatPageProps?.userCountry;
      const City = jsonObject.chatPageProps?.cfIpCity;
      const Title = jsonObject.meta?.title;

      // Return an object containing the extracted session information

      return {
        Country: Country || "",
        City: City || "",
        Title: Title || "",
      };
    } catch (error) {
      // Log an error with details to assist in debugging
      console.error("Error processing session info:", error);
      return {
        Country: "",
        City: "",
        Title: "",
      };
    }
  };

  /**
   * Reads a chat from a URL, processes and cleans its HTML, extracts data, and saves the results.
   * This is the only public method accessible externally.
   * @param params - An object containing the URL and flags for various operations.
   * @returns An object indicating the overall success status and any error encountered.
   */
  public async readChat(params: {
    url: string;
    minimize?: boolean;
    createHtml?: boolean;
    saveJson?: boolean;
  }): Promise<OperationResult<string>> {
    const {
      url,
      minimize = false,
      createHtml = false,
      saveJson = false,
    } = params;

    console.log("=== Starting Chat Processing ===");
    console.log(`URL: ${url}`);
    console.log(`Minimize: ${minimize}`);
    console.log(`Create HTML: ${createHtml}`);
    console.log(`Save JSON: ${saveJson}`);

    // Step 1: Process Chat
    const processResult = await this.processChat(url);
    if (!processResult.success || !processResult.data) {
      console.error("Failed to process chat. Exiting.");
      return this.onError(processResult.error || "Failed to process chat.");
    }

    // Step 2: Save Cleaned HTML (optional)
    if (createHtml) {
      const saveHtmlResult = await this.saveHtml(
        this.htmlFileName,
        processResult.data
      );
      if (!saveHtmlResult.success) {
        console.error("Failed to save HTML. Exiting.");
        return this.onError(saveHtmlResult.error || "Failed to save HTML.");
      }
    }

    // Step 3: Extract Server Response
    const extracted = await this.extractServerResponse({
      content: processResult.data,
    });
    if (!extracted.success || !extracted.data) {
      console.error("Failed to extract server response. Exiting.");
      return this.onError(
        extracted.error || "Failed to extract server response."
      );
    }

    // Step 4: Save Server Response JSON (optional)
    if (saveJson) {
      const saveJsonResult = await this.saveJson({
        data: extracted.data,
        filename: "serverResponse.json",
      });
      if (!saveJsonResult.success) {
        console.error("Failed to save server response JSON. Exiting.");
        return this.onError(
          saveJsonResult.error || "Failed to save server response JSON."
        );
      }
    }

    // Step 4.5: Extract Session Info
    const sessionInfo = await this.getSessionInfo({
      json: extracted.data,
    });

    // Step 5: Extract Messages from JSON
    const messages = this.extractMessagesFromJSON({
      json: extracted.data,
    });
    if (!messages.success || !messages.data) {
      console.error("Failed to extract messages from JSON. Exiting.");
      return this.onError(
        messages.error || "Failed to extract messages from JSON."
      );
    }

    // Step 6: Minimize Messages (optional)
    const minimized = this.minimizeMessagesFromJSON({
      json: messages.data,
      minimized: minimize,
    });
    if (!minimized.success || !minimized.data) {
      console.error("Failed to minimize messages. Exiting.");
      return this.onError(minimized.error || "Failed to minimize messages.");
    }

    // Step 7: Organize Messages
    const organized = this.organizeMessages({
      messagesJSON: minimized.data,
    });
    if (!organized.success || !organized.data) {
      console.error("Failed to organize messages. Exiting.");
      return this.onError(organized.error || "Failed to organize messages.");
    }

    // Step 8: Calculate Global Statistics
    let globalStats: GlobalStatisticsResult;
    try {
      globalStats = this.globalStatistics({
        json: organized.data, // Pass organized messages
        sessionInfo: sessionInfo,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Failed to calculate global statistics: ${error.message}`
        );
        return this.onError("Failed to calculate global statistics.");
      } else {
        console.error("Unknown error calculating global statistics.");
        return this.onError("Unknown error calculating global statistics.");
      }
    }

    // // Step 9: Save Final JSON Output
    // const saveFinalJsonResult = await this.saveJson({
    //   data: globalStats.content,
    //   filename: "messages.json",
    // });

    // if (!saveFinalJsonResult.success) {
    //   console.error("Failed to save final JSON output. Exiting.");
    //   return this.onError(
    //     saveFinalJsonResult.error || "Failed to save final JSON output."
    //   );
    // }

    // console.log("=== Chat Processing Completed Successfully ===");
    return {
      success: true,
      data: globalStats.content || "{}",
    };
  }

  /**
   * Reads a chat from a URL, processes and cleans its HTML, extracts data, and saves the results.
   * This is the only public method accessible externally.
   * @param params - An object containing the URL and flags for various operations.
   * @returns An object indicating the overall success status and any error encountered.
   */
  public async readChatFrontEnd(params: {
    minimize?: boolean;
    processResult: string;
  }): Promise<{ status: boolean; data?: string; error?: string }> {
    try {
      const { minimize = false, processResult } = params;

      // Step 1: Extract Server Response
      const extracted = await this.extractServerResponse({
        content: processResult,
      });
      if (!extracted.success || !extracted.data) {
        console.error("Failed to extract server response. Exiting.");

        return {
          status: false,
          error: "Failed to extract server response.", // Only returning the stringified content
        };
      }

      // Step 2: Extract Session Info
      const sessionInfo = await this.getSessionInfo({
        json: extracted.data,
      });

      // Step 3: Extract Messages from JSON
      const messages = this.extractMessagesFromJSON({
        json: extracted.data,
      });
      if (!messages.success || !messages.data) {
        console.error("Failed to extract messages from JSON. Exiting.");

        return {
          status: false,
          error: "Failed to extract messages from JSON.", // Only returning the stringified content
        };
      }

      // Step 4: Minimize Messages (optional)
      const minimized = this.minimizeMessagesFromJSON({
        json: messages.data,
        minimized: minimize,
      });
      if (!minimized.success || !minimized.data) {
        console.error("Failed to minimize messages. Exiting.");

        return {
          status: false,
          error: "Failed to minimize messages.", // Only returning the stringified content
        };
      }

      // Step 5: Organize Messages
      const organized = this.organizeMessages({
        messagesJSON: minimized.data,
      });
      if (!organized.success || !organized.data) {
        console.error("Failed to organize messages. Exiting.");

        return {
          status: false,
          error: "Failed to organize messages.", // Only returning the stringified content
        };
      }

      // Step 6: Calculate Global Statistics
      const globalStats = this.globalStatistics({
        json: organized.data,
        sessionInfo: sessionInfo,
      });

      if (!globalStats || !globalStats.content) {
        console.error("Failed to calculate global statistics. Exiting.");

        return {
          status: false,
          error: "Failed to calculate global statistics.", // Only returning the stringified content
        };
      }

      return {
        status: true,
        data: globalStats.content, // Only returning the stringified content
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Failed to calculate global statistics: ${error.message}`
        );
        return {
          status: false,
          error: "Failed to calculate global statistics.", // Only returning the stringified content
        };
      } else {
        console.error("Unknown error calculating global statistics.");

        return {
          status: false,
          error: "Unknown error calculating global statistics.", // Only returning the stringified content
        };
      }
    }
  }
}

// // Entry point
// const app = async ({
//   url,
//   minimize = false,
//   createHtml = false,
//   saveJson = false,
// }: {
//   url: string;
//   minimize?: boolean;
//   createHtml?: boolean;
//   saveJson?: boolean;
// }) => {
//   const gpt = new GptScrapper();
//   const result = await gpt.readChat({ url, minimize, createHtml, saveJson });

//   if (result.success) {
//     console.log("Chat processing completed successfully.");
//   } else {
//     console.error(`Chat processing failed: ${result.error}`);
//   }
// };

// const url = "https://chatgpt.com/share/67449f60-81f4-8011-8775-5f1307d12394";

// app({ url, minimize: false, createHtml: false, saveJson: false });
