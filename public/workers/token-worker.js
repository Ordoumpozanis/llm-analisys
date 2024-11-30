import { init, Tiktoken } from "tiktoken/lite/init";
import wasmBinary from "tiktoken/lite/tiktoken_bg.wasm";
import cl100k_base from "tiktoken/encoders/cl100k_base.json";

let encoder;

async function initialize() {
  // Fetch the WASM binary if the import doesn't provide an ArrayBuffer
  let wasmModule;
  if (wasmBinary instanceof ArrayBuffer) {
    wasmModule = wasmBinary;
  } else {
    const response = await fetch(wasmBinary);
    wasmModule = await response.arrayBuffer();
  }

  await init((imports) => WebAssembly.instantiate(wasmModule, imports));
  encoder = new Tiktoken(
    cl100k_base.bpe_ranks,
    cl100k_base.special_tokens,
    cl100k_base.pat_str
  );
}

// Helper function to process a single message with a timeout
const processWithTimeout = (
  message,
  length,
  messageNumber,
  timeout = 10000
) => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(message); // Return original message on timeout
    }, timeout);

    processObject(message, length, messageNumber)
      .then((processedMessage) => {
        clearTimeout(timer);
        resolve(processedMessage);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(message); // Return original message on error
      });
  });
};

// Helper function to process the object
const processObject = async (message, length = true, messageNumber) => {
  if (
    !message.content ||
    !message.content.parts ||
    message.content.parts.length === 0
  ) {
    return message;
  }

  const authorPart = message.content.parts[0];
  if (!authorPart || authorPart.trim() === "") {
    return message;
  }

  try {
    const tokens = encoder.encode(`${authorPart}`);
    // Update the message with either token length or tokens
    message.content.parts[0] = length ? tokens.length : tokens;
  } catch {
    // If encoding fails, return the original message
    return message;
  }

  if (message.content.parts[0] == null) {
    self.postMessage({ id: messageNumber, status: true });
    return message;
  }

  return message;
};

// Handle incoming messages to the worker
self.onmessage = async (event) => {
  try {
    const { messages, length } = event.data; // Expecting an array of messages and length flag

    if (!Array.isArray(messages)) {
      throw new Error("Expected 'messages' to be an array.");
    }

    if (!encoder) {
      await initialize();
    }

    const totalMessages = messages.length;
    let processedCount = 0;
    const processedMessages = [];

    // Create an array of promises with timeout handling
    const processingPromises = messages.map((message, index) =>
      processWithTimeout(message, length, index + 1, 10000).then((result) => {
        processedMessages[index] = result; // Maintain order
        processedCount += 1;
        const percentage = Math.round((processedCount / totalMessages) * 100);
        // Send progress update to frontend
        self.postMessage({ progress: percentage });
      })
    );

    // Process all messages asynchronously
    await Promise.all(processingPromises);

    // Once all messages are processed, send the final array
    self.postMessage({ success: true, data: processedMessages });
  } catch (error) {
    console.error("TokenWorker encountered an error:", error);
    // In case of unexpected errors, return an empty array or handle accordingly
    self.postMessage({ success: false, error: error.message });
  }
};
