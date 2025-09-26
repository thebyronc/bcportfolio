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
 * Process OCR request using Google Gemini AI
 * @param {Request} request Express request object
 * @param {Response} response Express response object
 */
export async function processOcr(request: Request, response: Response) {
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

    // Parse request body (expecting JSON with base64Image and mimeType)
    const {base64Image, mimeType} = request.body;

    if (!base64Image) {
      console.error("No base64 image found in request body");
      response.status(400).json({error: "No image provided"});
      return;
    }

    console.log("Processing base64 image:", {
      base64Length: base64Image.length,
      mimeType: mimeType || "not provided",
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = "Analyze this receipt image and extract all line items " +
      "with their prices. Return the data in this exact JSON format:\n" +
      "{\n" +
      "  \"rawText\": \"the complete extracted text from the receipt\",\n" +
      "  \"items\": [\n" +
      "    {\n" +
      "      \"description\": \"item name\",\n" +
      "      \"amount\": 12.99,\n" +
      "      \"confidence\": 0.95\n" +
      "    }\n" +
      "  ]\n" +
      "}";

    // Determine MIME type - use provided or detect from base64
    let finalMimeType = mimeType;

    if (!finalMimeType || finalMimeType.trim() === "") {
      // Try to detect MIME type from base64 data
      if (base64Image.startsWith("/9j/") || base64Image.startsWith("/9j4AAQ")) {
        finalMimeType = "image/jpeg";
      } else if (base64Image.startsWith("iVBORw0KGgo")) {
        finalMimeType = "image/png";
      } else if (base64Image.startsWith("R0lGOD")) {
        finalMimeType = "image/gif";
      } else if (base64Image.startsWith("UklGR")) {
        finalMimeType = "image/webp";
      } else {
        finalMimeType = "image/jpeg"; // Default fallback
      }
      console.log("Detected MIME type:", finalMimeType);
    }

    console.log("Sending request to Gemini API with MIME type:", finalMimeType);

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: finalMimeType,
        },
      },
    ]);

    const geminiResponse = await result.response;
    const text = geminiResponse.text();
    console.log("Received response from Gemini API, length:", text.length);

    // Try to parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
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
        response.json({text: text, items: []});
        return;
      }
    }

    response.json({text: text, items: []});
  } catch (error) {
    console.error("Server-side OCR Error:", error);
    const errorMessage = error instanceof Error ?
      error.message :
      "Unknown error occurred";
    response.status(500).json({
      error: `Failed to process image: ${errorMessage}`,
    });
  }
}
