import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

async function generateTravelPlan(destination, duration, estimatedCost) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a knowledgeable travel planner assistant. Provide detailed and practical travel plans."
        },
        {
          role: "user",
          content: `Create a travel plan for a trip to ${destination} for ${duration} days with an estimated budget of ${estimatedCost}. Include daily activities, recommended accommodations, and dining suggestions.`
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating travel plan:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
}

export async function planTravel(destination, duration, estimatedCost) {
  try {
    const travelPlan = await generateTravelPlan(destination, duration, estimatedCost);
    console.log("Generated Travel Plan:");
    console.log(travelPlan);
    return travelPlan;
  } catch (error) {
    console.error("Failed to generate travel plan:", error.message);
    return "Sorry, we couldn't generate a travel plan at this time. Please try again later.";
  }
}