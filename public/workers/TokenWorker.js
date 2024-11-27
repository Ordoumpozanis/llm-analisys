import { encoding_for_model } from "tiktoken";

self.onmessage = (e) => {
  console.log("[TokenWorker] Message received:", e.data);
  const { taskId, message, modelName, lenght } = e.data;

  const processMessage = (message, modelName, lenght = true) => {
    const authorPart = message?.content?.parts?.[0];
    if (!authorPart || authorPart === "")
      return new Error("Invalid message format");

    const enc = encoding_for_model(modelName);
    const tokens = enc.encode(authorPart);
    enc.free?.();
    message.content.parts[0] = lenght ? tokens.length : tokens;
    return message;
  };

  try {
    const result = processMessage(message, modelName, lenght);
    console.log("[TokenWorker] Task completed:", taskId, result);
    self.postMessage({ taskId, result });
  } catch (error) {
    console.error("[TokenWorker] Error:", error.message);
    self.postMessage({ taskId, error: error.message });
  }
};
