import { HfInference } from "@huggingface/inference";

const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
// Using a smaller, more reliable model
const MODEL_ID = "gpt2"; // Changed from facebook/opt-125m

const hf = new HfInference(API_KEY);

// Improved delay function with exponential backoff
const delay = (attemptNumber) => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 10000; // 10 seconds
  const calculatedDelay = Math.min(
    baseDelay * Math.pow(2, attemptNumber),
    maxDelay
  );
  return new Promise((resolve) => setTimeout(resolve, calculatedDelay));
};

// Enhanced API call with better error handling
const attemptApiCall = async (prompt, maxAttempts = 3) => {
  let lastError = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await hf.textGeneration({
        model: MODEL_ID,
        inputs: prompt,
        parameters: {
          max_new_tokens: 150, // Reduced tokens
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.2,
          do_sample: true,
          wait_for_model: true, // Add this to ensure model is loaded
        },
      });

      if (!response?.generated_text) {
        throw new Error("Empty response received");
      }

      return response;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error);

      // Check for specific error types
      if (error.response?.status === 401) {
        throw new Error("Invalid API key. Please check your configuration.");
      }

      if (attempt < maxAttempts - 1) {
        await delay(attempt);
      }
    }
  }

  // If we've exhausted all attempts, throw a user-friendly error
  throw new Error(
    `Failed to generate travel plan after ${maxAttempts} attempts. ` +
      `${lastError?.message || "Service is temporarily unavailable."}`
  );
};

export const planTravel = async (location, duration, estimatedCost) => {
  try {
    validateTravelInput(location, duration, estimatedCost);

    if (!API_KEY) {
      throw new Error(
        "API key is not set. Please check your environment variables."
      );
    }

    // Simplified prompt to reduce token usage
    const prompt = `Brief travel plan for ${duration} days in ${location} with $${estimatedCost} budget:
1. Key attractions
2. Where to stay
3. Local food
4. Transportation
5. Budget breakdown`;

    const response = await attemptApiCall(prompt);

    // Clean and format the response
    const cleanedText = response.generated_text
      .trim()
      .replace(/^Assistant:|^Human:/gm, "")
      .replace(/\n{3,}/g, "\n\n");

    if (cleanedText.length < 50) {
      throw new Error("Generated response too short, please try again");
    }

    return cleanedText;
  } catch (error) {
    // Add user-friendly error message
    const errorMessage = error.message.includes("API key")
      ? error.message
      : "Unable to generate travel plan at the moment. Please try again in a few moments.";

    console.error("Error in planTravel:", error);
    throw new Error(errorMessage);
  }
};

export const validateTravelInput = (location, duration, estimatedCost) => {
  const errors = [];

  if (!location || location.trim().length < 2) {
    errors.push("Please enter a valid location");
  }

  if (!duration || duration < 1 || duration > 30) {
    errors.push("Duration must be between 1 and 30 days");
  }

  if (!estimatedCost || estimatedCost < 50) {
    errors.push("Budget must be at least $50");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(". "));
  }

  return true;
};
