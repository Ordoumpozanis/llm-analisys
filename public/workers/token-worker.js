let encodingForModel; // Initialize this outside for reuse

const processMessage = async (message, modelName, length = true) => {
  if (!encodingForModel) {
    // Dynamically import tiktoken when needed
    const { encoding_for_model } = await import("tiktoken");
    encodingForModel = encoding_for_model;
  }

  const authorPart = message?.content?.parts?.[0];
  if (!authorPart || authorPart === "") return null;

  // Encode the message content
  const enc = encodingForModel(modelName);
  const tokens = enc.encode(authorPart);
  enc.free?.(); // Free resources if the method exists

  // Update the message with token data
  message.content.parts[0] = length ? tokens.length : tokens;
  return message;
};

self.onmessage = async (event) => {
  try {
    const { message, modelName, length } = event.data;

    // Process the message and get the result
    const result = await processMessage(message, modelName, length);

    // Send the result back to the main thread
    self.postMessage({ success: true, data: result });
  } catch (error) {
    console.error("TokenWorker encountered an error:", error);
    self.postMessage({ success: false, error: error.message });
  }
};
