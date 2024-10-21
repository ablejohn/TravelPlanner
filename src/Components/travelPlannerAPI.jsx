// travelPlannerAPI.js
import axios from "axios";

const OPENAI_API_KEY =
  "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"; // Replace with your key

export const planTravel = async (location, duration, estimatedCost) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a travel assistant. Generate a detailed travel plan based on the user's inputs.",
          },
          {
            role: "user",
            content: `Plan a trip to ${location} for ${duration} days with an estimated budget of $${estimatedCost}. Provide a detailed day-by-day itinerary.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw new Error("Could not generate a travel plan.");
  }
};
