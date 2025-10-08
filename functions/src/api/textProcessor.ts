import {GoogleGenerativeAI} from "@google/generative-ai";
import {Request, Response} from "express";
import {setCorsHeaders} from "../utils/cors";
import {defineSecret} from "firebase-functions/params";

// Define the secret
const googleApiKey = defineSecret("GOOGLE_AI_API_KEY");

/**
 * Get API key from Firebase secrets
 * @return {string} The Google AI API key
 */
const getApiKey = () => {
  return googleApiKey.value();
};

/**
 * Process text request using Google Gemini AI
 * @param {Request} request Express request object
 * @param {Response} response Express response object
 */
export async function processText(request: Request, response: Response) {
  // Set CORS headers
  setCorsHeaders(response);

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    response.status(200).send("");
    return;
  }

  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.error("Google AI API key not found in Firebase Functions config");
      response.status(500).json({error: "Google AI API key not found"});
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Parse request body (expecting JSON with text)
    const {text} = request.body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      console.error("No text found in request body");
      response.status(400).json({error: "No text provided"});
      return;
    }

    console.log("Processing text input:", {
      textLength: text.length,
      textPreview: text.substring(0, 100) + "...",
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = "Analyze this receipt text and extract all line items " +
      "with their prices. Look for items, descriptions, and amounts. " +
      "Return the data in this exact JSON format:\n" +
      "{\n" +
      "  \"rawText\": \"the original text that was provided\",\n" +
      "  \"items\": [\n" +
      "    {\n" +
      "      \"description\": \"item name or description\",\n" +
      "      \"amount\": 12.99,\n" +
      "      \"confidence\": 0.95\n" +
      "    }\n" +
      "  ]\n" +
      "}\n\n" +
      "Instructions:\n" +
      "- Extract individual line items with their prices\n" +
      "- Ignore subtotals, taxes, and totals unless they are specific items\n" +
      "- If a line doesn't have a clear price, skip it\n" +
      "- Set confidence based on how clear the item and price are\n" +
      "- Return an empty items array if no clear line items are found\n\n" +
      "Receipt text to analyze:\n" + text;

    console.log("Sending request to Gemini API for text processing");

    const result = await model.generateContent([prompt]);

    const geminiResponse = await result.response;
    const responseText = geminiResponse.text();
    console.log("Received response from Gemini API, length:", responseText.length);

    // Try to parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        response.json({
          text: parsed.rawText || text,
          items: parsed.items || [],
        });
        return;
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        // Fallback: try to extract items using simple text parsing
        const fallbackItems = extractItemsFromText(text);
        response.json({
          text: text,
          items: fallbackItems,
        });
        return;
      }
    }

    // Fallback if no JSON found
    const fallbackItems = extractItemsFromText(text);
    response.json({
      text: text,
      items: fallbackItems,
    });
  } catch (error) {
    console.error("Server-side text processing error:", error);
    const errorMessage = error instanceof Error ?
      error.message :
      "Unknown error occurred";
    response.status(500).json({
      error: `Failed to process text: ${errorMessage}`,
    });
  }
}

/**
 * Fallback function to extract items from text using simple parsing
 * @param {string} text The text to parse
 * @return {Array} Array of extracted items
 */
function extractItemsFromText(text: string): Array<{description: string, amount: number, confidence: number}> {
  const lines = text.split('\n').filter(line => line.trim());
  const items: Array<{description: string, amount: number, confidence: number}> = [];
  
  lines.forEach((line, index) => {
    // Look for price patterns like $X.XX or X.XX
    const priceMatch = line.match(/\$?(\d+\.?\d*)/g);
    if (priceMatch && priceMatch.length > 0) {
      const lastPrice = priceMatch[priceMatch.length - 1];
      const amount = parseFloat(lastPrice.replace('$', ''));
      
      if (!isNaN(amount) && amount > 0) {
        // Remove the price from the description
        const description = line.replace(/\$?\d+\.?\d*/, '').trim();
        if (description) {
          items.push({
            description: description || `Item ${index + 1}`,
            amount: amount,
            confidence: 0.6 // Lower confidence for fallback parsing
          });
        }
      }
    }
  });
  
  return items;
}
