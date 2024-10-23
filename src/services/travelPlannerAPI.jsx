import { HfInference } from "@huggingface/inference";

const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2";

const hf = new HfInference(API_KEY);

const delay = (attemptNumber) => {
  const baseDelay = 1000;
  const maxDelay = 10000;
  const calculatedDelay = Math.min(
    baseDelay * Math.pow(2, attemptNumber),
    maxDelay
  );
  return new Promise((resolve) => setTimeout(resolve, calculatedDelay));
};

const generatePrompt = (location, duration, estimatedCost) => `
[INST]As a travel planner, create a detailed ${duration}-day travel plan for ${location} with a budget of $${estimatedCost}.

Respond EXACTLY in this format:

KEY ATTRACTIONS:
- List 3-4 must-visit attractions
- Include entry fees and recommended visit duration
- Total attractions budget

ACCOMMODATION:
- 2-3 specific hotel/hostel recommendations
- Include price per night
- Total accommodation budget

FOOD RECOMMENDATIONS:
- 3-4 local dishes or restaurants
- Price range for each
- Estimated daily food budget

TRANSPORTATION:
- Best ways to get around
- Specific costs for tickets/passes
- Total transportation budget

BUDGET BREAKDOWN:
- Daily breakdown of all expenses
- Category totals
- Must stay within total budget of $${estimatedCost}[/INST]`;

const attemptApiCall = async (prompt, maxAttempts = 3) => {
  let lastError = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await hf.textGeneration({
        model: MODEL_ID,
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.2,
          do_sample: true,
          wait_for_model: true,
          stop: ["[/INST]", "Human:", "Assistant:"],
        },
      });

      if (!response?.generated_text) {
        throw new Error("Empty response received");
      }

      // Clean up the response
      const cleanedText = response.generated_text
        .replace(prompt, "")
        .replace(/\[\/INST\]/g, "")
        .replace(/^[\s\n]*/, "")
        .trim();

      return { generated_text: cleanedText };
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      lastError = error;

      if (error.response?.status === 401) {
        throw new Error("Invalid API key");
      }

      if (attempt < maxAttempts - 1) {
        console.log(`Retrying in ${await delay(attempt)}ms...`);
        continue;
      }

      throw lastError;
    }
  }
};

const processResponse = (text) => {
  const sections = {
    attractions: "",
    accommodation: "",
    food: "",
    transportation: "",
    budget: "",
  };

  // More specific regex patterns
  const sectionPatterns = {
    attractions: /KEY ATTRACTIONS:([\s\S]*?)(?=ACCOMMODATION:|$)/i,
    accommodation: /ACCOMMODATION:([\s\S]*?)(?=FOOD RECOMMENDATIONS:|$)/i,
    food: /FOOD RECOMMENDATIONS:([\s\S]*?)(?=TRANSPORTATION:|$)/i,
    transportation: /TRANSPORTATION:([\s\S]*?)(?=BUDGET BREAKDOWN:|$)/i,
    budget: /BUDGET BREAKDOWN:([\s\S]*?)$/i,
  };

  Object.entries(sectionPatterns).forEach(([key, pattern]) => {
    const match = text.match(pattern);
    sections[key] = match
      ? match[1].trim()
      : "No specific information available.";
  });

  return sections;
};

const validateBudgetBreakdown = (text, totalBudget) => {
  const budgetSection = text.match(/BUDGET BREAKDOWN:[\s\S]*?(?=\n\n|$)/);
  if (!budgetSection) return true;

  const amounts = budgetSection[0].match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g);
  if (!amounts) return true;

  const total = parseFloat(amounts[amounts.length - 1].replace(/[$,]/g, ""));
  return total <= totalBudget * 1.1;
};

export const planTravel = async (location, duration, estimatedCost) => {
  try {
    validateTravelInput(location, duration, estimatedCost);

    if (!API_KEY) {
      throw new Error("API key is not set");
    }

    const prompt = generatePrompt(location, duration, estimatedCost);
    const response = await attemptApiCall(prompt);

    if (!response?.generated_text) {
      throw new Error("Failed to generate travel plan.");
    }

    let processedResponse = processResponse(response.generated_text);

    if (!validateBudgetBreakdown(response.generated_text, estimatedCost)) {
      console.warn("Budget exceeded, retrying...");
      const retryResponse = await attemptApiCall(prompt);
      processedResponse = processResponse(retryResponse.generated_text);
    }

    return processedResponse;
  } catch (error) {
    console.error("Error in planTravel:", error);
    throw new Error(error.message || "Failed to generate travel plan");
  }
};

export const validateTravelInput = (location, duration, estimatedCost) => {
  const errors = [];

  if (!location || location.trim().length < 2) {
    errors.push("Please enter a valid location");
  }

  const numDuration = Number(duration);
  if (!numDuration || numDuration < 1 || numDuration > 30) {
    errors.push("Duration must be between 1 and 30 days");
  }

  const numCost = Number(estimatedCost);
  if (!numCost || numCost < 50) {
    errors.push("Budget must be at least $50");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(". "));
  }

  return true;
};
