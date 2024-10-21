import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

export const planTravel = async (location, duration, estimatedCost) => {
  try {
    if (!API_KEY) {
      throw new Error(
        "API key is not set. Please check your environment variables."
      );
    }

    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful travel planner assistant.",
          },
          {
            role: "user",
            content: `Plan a ${duration}-day trip to ${location} with a budget of $${estimatedCost}.`,
          },
        ],
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("Error in planTravel:", error);
    if (error.response) {
      if (error.response.status === 429) {
        throw new Error("API rate limit exceeded. Please try again later.");
      } else {
        throw new Error(`API error: ${error.response.status}`);
      }
    } else if (error.request) {
      throw new Error("No response received from the server.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};
