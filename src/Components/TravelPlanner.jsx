// src/services/travelPlannerAPI.jsx
import { HfInference } from "@huggingface/inference";

const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
// Using a more stable model
const MODEL_ID = "google/flan-t5-base";

const hf = new HfInference(API_KEY);

// Helper function to delay between retries
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to attempt the API call with retries
const attemptApiCall = async (prompt, attempts = 3, delayMs = 1000) => {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await hf.textGeneration({
        model: MODEL_ID,
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.2,
        },
      });
      return response;
    } catch (error) {
      if (i === attempts - 1) throw error; // If last attempt, throw the error
      console.log(`Attempt ${i + 1} failed, retrying...`);
      await delay(delayMs); // Wait before retrying
    }
  }
};

export const planTravel = async (location, duration, estimatedCost) => {
  try {
    if (!API_KEY) {
      throw new Error(
        "API key is not set. Please check your environment variables."
      );
    }

    const prompt = `Create a travel plan for ${duration} days in ${location} with a budget of $${estimatedCost}.
    Include:
    - Daily activities
    - Places to visit
    - Restaurant recommendations
    - Transportation tips
    - Budget breakdown`;

    const response = await attemptApiCall(prompt);

    if (response && response.generated_text) {
      return response.generated_text.trim();
    } else {
      throw new Error("No response generated");
    }
  } catch (error) {
    console.error("Error in planTravel:", error);

    // More specific error messages
    if (error.message === "Service Unavailable") {
      throw new Error(
        "The AI service is temporarily unavailable. Please try again in a few moments."
      );
    } else if (error.response?.status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    } else if (error.response?.status === 401) {
      throw new Error("Invalid API key. Please check your configuration.");
    } else {
      throw new Error("Failed to generate travel plan. Please try again.");
    }
  }
};
