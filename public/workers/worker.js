import { GptScrapper } from "../../lib/gptAnalisysFront";

const scraper = new GptScrapper();

console.log("Worker initialized!");

self.onmessage = async function (e) {
  const { content, minimize = false } = e.data;
  console.log("Worker received content:", content);
  try {
    const result = await scraper.readChatFrontEnd({
      processResult: content,
      minimize: minimize,
    });

    if (result.status) {
      self.postMessage({ success: true, data: JSON.parse(result.data) });
    } else {
      self.postMessage({ success: false, error: result.error });
    }
  } catch (error) {
    console.error("Worker error:", error);
    self.postMessage({ success: false, error: error.message });
  }
};
