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

// Keep the prompt template internal only
const generatePrompt = (location, duration, estimatedCost) => {
  const dailyBudget = Math.floor(estimatedCost / duration);
  
  return `As a travel expert, create a ${duration}-day travel plan for ${location} with a total budget of $${estimatedCost}.

KEY ATTRACTIONS:
[List 3-4 must-visit places with time needed and entry costs]

ACCOMMODATION:
[Specify area, type, and nightly cost]

FOOD RECOMMENDATIONS:
[List 2-3 local dishes with restaurants and costs]

TRANSPORTATION:
[List best ways to get around with costs]

BUDGET BREAKDOWN:
[Break down all costs, total must be under $${estimatedCost}]`;
};

const attemptApiCall = async (prompt, maxAttempts = 3) => {
  let lastError = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await hf.textGeneration({
        model: MODEL_ID,
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.3,
          top_p: 0.9,
          repetition_penalty: 1.2,
          do_sample: true,
          wait_for_model: true,
        },
      });

      if (!response?.generated_text) {
        throw new Error("Empty response received");
      }

      return response;
    } catch (error) {
      lastError = error;
      if (error.response?.status === 401) {
        throw new Error("Invalid API key");
      }
      if (attempt < maxAttempts - 1) {
        await delay(attempt);
        continue;
      }
      throw lastError;
    }
  }
};

const processResponse = (text) => {
  // Extract just the generated content without any prompt templates
  const sections = [
    "KEY ATTRACTIONS",
    "ACCOMMODATION",
    "FOOD RECOMMENDATIONS",
    "TRANSPORTATION",
    "BUDGET BREAKDOWN"
  ];
  
  let cleanedText = "";
  let currentSection = "";
  
  // Process the text line by line
  const lines = text.split('\n');
  for (let line of lines) {
    line = line.trim();
    
    // Skip empty lines and prompt templates
    if (!line || line.includes("[") || line.includes("Important:") || line.includes("must be")) {
      continue;
    }
    
    // Check if this is a section header
    const sectionHeader = sections.find(section => 
      line.toUpperCase().includes(section)
    );
    
    if (sectionHeader) {
      // Add spacing between sections
      if (cleanedText) {
        cleanedText += "\n\n";
      }
      currentSection = sectionHeader;
      cleanedText += `${line}\n`;
    } else if (line && currentSection) {
      // Add content lines that don't match prompt templates
      if (!line.includes("List") && !line.includes("Specify") && !line.includes("Break down")) {
        cleanedText += `${line}\n`;
      }
    }
  }
  
  // Clean up any remaining prompt artifacts
  cleanedText = cleanedText
    .replace(/\[.*?\]/g, '')                    // Remove any remaining bracketed content
    .replace(/\n{3,}/g, '\n\n')                 // Replace multiple newlines with double newlines
    .replace(/- Area:/g, 'Area:')               // Clean up formatting
    .replace(/- Type:/g, 'Type:')
    .replace(/- Cost:/g, 'Cost:')
    .trim();
  
  return cleanedText;
};

const validateBudgetBreakdown = (text, totalBudget) => {
  const budgetSection = text.match(/BUDGET BREAKDOWN:[\s\S]*?(?=\n\n|$)/);
  if (!budgetSection) return true;

  const amounts = budgetSection[0].match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g);
  if (!amounts) return true;

  const total = amounts[amounts.length - 1].replace(/[$,]/g, '');
  return parseFloat(total) <= totalBudget * 1.1;
};

export const planTravel = async (location, duration, estimatedCost) => {
  try {
    validateTravelInput(location, duration, estimatedCost);

    if (!API_KEY) {
      throw new Error("API key is not set");
    }

    const prompt = generatePrompt(location, duration, estimatedCost);
    const response = await attemptApiCall(prompt);
    let cleanedText = processResponse(response.generated_text);

    if (cleanedText.length < 100) {
      throw new Error("Generated response is too short");
    }

    if (!validateBudgetBreakdown(cleanedText, estimatedCost)) {
      const retryResponse = await attemptApiCall(prompt);
      cleanedText = processResponse(retryResponse.generated_text);
      
      if (!validateBudgetBreakdown(cleanedText, estimatedCost)) {
        throw new Error("Budget allocation exceeds total budget");
      }
    }

    return cleanedText;

  } catch (error) {
    throw new Error(`Unable to generate travel plan: ${error.message}`);
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