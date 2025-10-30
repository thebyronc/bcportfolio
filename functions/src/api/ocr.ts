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

    const prompt = "Analyze this receipt image and extract structured data. " +
      "Return the data in this exact JSON format (omit fields you cannot find):\n" +
      "{\n" +
      "  \"rawText\": \"the complete extracted text from the receipt\",\n" +
      "  \"storeName\": \"optional store name if present\",\n" +
      "  \"date\": \"optional purchase date found on the receipt\",\n" +
      "  \"time\": \"optional purchase time found on the receipt\",\n" +
      "  \"taxPaid\": 1.23,\n" +
      "  \"tipPaid\": 2.34,\n" +
      "  \"items\": [\n" +
      "    {\n" +
      "      \"description\": \"item name\",\n" +
      "      \"amount\": 12.99,\n" +
      "      \"confidence\": 0.95\n" +
      "    }\n" +
      "  ]\n" +
      "}\n\n" +
      "Instructions:\n" +
      "- Extract individual line items with their prices.\n" +
      "- Identify and include tax paid and tip paid as numeric amounts when present; use synonyms like 'gratuity' or 'service charge' for tip. Do not include tax paid and tip paid if they are not present on the receipt. Do not include 'subtotal' or 'total' as tax paid or tip paid. \n" +
      "- Include store name, date, and time if they appear anywhere on the receipt; do not guess.\n" +
      "- Use numbers for amounts (no currency symbols).\n" +
      "- If a field is not clearly present, omit it from the JSON rather than inventing a value.";

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
        const meta = extractMetaFromText(parsed.rawText || text);
        response.json({
          text: parsed.rawText || text,
          items: parsed.items || [],
          storeName: parsed.storeName ?? meta.storeName,
          date: parsed.date ?? meta.date,
          time: parsed.time ?? meta.time,
          taxPaid: parsed.taxPaid ?? meta.taxPaid,
          tipPaid: parsed.tipPaid ?? meta.tipPaid,
        });
        return;
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        const meta = extractMetaFromText(text);
        response.json({text: text, items: [], ...meta});
        return;
      }
    }

    const meta = extractMetaFromText(text);
    response.json({text: text, items: [], ...meta});
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

// Heuristic extraction of storeName, date, time, taxPaid, tipPaid from plain text
function extractMetaFromText(raw: string): {
  storeName?: string;
  date?: string;
  time?: string;
  taxPaid?: number;
  tipPaid?: number;
} {
  const result: {
    storeName?: string;
    date?: string;
    time?: string;
    taxPaid?: number;
    tipPaid?: number;
  } = {};

  if (!raw) return result;

  const text = raw.replace(/[\t\r]/g, "\n");
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);

  // Store name: choose the first non-empty line that isn't obviously metadata
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (
      lower.includes("total") ||
      lower.includes("subtotal") ||
      lower.includes("tax") ||
      lower.includes("tip") ||
      lower.includes("gratuity") ||
      lower.includes("service charge") ||
      lower.includes("receipt") ||
      lower.includes("thank") ||
      lower.includes("address") ||
      lower.includes("http") ||
      lower.includes("www")
    ) {
      continue;
    }
    result.storeName = line;
    break;
  }

  // Date formats: 2025-10-30, 10/30/2025, 30/10/2025, Oct 30 2025, October 30, 2025
  const dateRegexes = [
    /(\b\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2}\b)/, // YYYY-MM-DD
    /(\b\d{1,2}[-\/.]\d{1,2}[-\/.]\d{2,4}\b)/, // MM/DD/YYYY or DD/MM/YYYY
    /(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2}(?:,)?\s+\d{2,4}\b)/i, // Month D, YYYY
  ];
  for (const rx of dateRegexes) {
    const m = text.match(rx);
    if (m && m[1]) {
      result.date = m[1];
      break;
    }
  }

  // Time formats: 14:05, 14:05:33, 2:05 PM, 2:05:33 pm
  const timeRegex = /(\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?\b)/;
  const timeMatch = text.match(timeRegex);
  if (timeMatch) {
    result.time = timeMatch[1];
  }

  // Amount extract helper
  const extractAmount = (line: string): number | undefined => {
    const m = line.match(/\$?\s*(\d{1,5}(?:\.\d{1,2})?)/);
    if (!m) return undefined;
    const val = parseFloat(m[1]);
    return isNaN(val) ? undefined : val;
  };

  // Tax and Tip
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (result.taxPaid === undefined && lower.includes("tax")) {
      const amt = extractAmount(line);
      if (amt !== undefined) result.taxPaid = amt;
      continue;
    }
    if (
      result.tipPaid === undefined &&
      (lower.includes("tip") || lower.includes("gratuity") || lower.includes("service charge"))
    ) {
      const amt = extractAmount(line);
      if (amt !== undefined) result.tipPaid = amt;
      continue;
    }
    if (result.taxPaid !== undefined && result.tipPaid !== undefined) break;
  }

  return result;
}
