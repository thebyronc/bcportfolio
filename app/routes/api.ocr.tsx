import { GoogleGenerativeAI } from '@google/generative-ai';

// Server-side API key access (secure)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function loader() {
  return { message: 'OCR API endpoint' };
}

export async function action({ request }: { request: Request }) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return { error: 'No image provided' };
    }

    // Convert file to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create the prompt for receipt parsing
    const prompt = `
    Analyze this receipt image and extract all line items. For each item, provide:
    1. A clear description of the item
    2. The price/amount
    3. Your confidence level (0-1) for the extraction
    
    Return the data in this JSON format:
    {
      "rawText": "the complete text from the receipt",
      "items": [
        {
          "description": "item name",
          "amount": 12.99,
          "confidence": 0.95
        }
      ]
    }
    
    Focus on:
    - Food items, drinks, and products
    - Skip headers, footers, totals, taxes, tips
    - Only include individual line items with prices
    - Be accurate with decimal places
    - Clean up any OCR artifacts in descriptions
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: imageFile.type
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        text: parsed.rawText || text,
        items: parsed.items || []
      };
    }
    
    // Fallback if JSON parsing fails
    return {
      text: text,
      items: []
    };
    
  } catch (error) {
    console.error('Server-side OCR Error:', error);
    return { error: 'Failed to process image' };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64 data
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

// Default export for React Router
export default function ApiOcr() {
  return null; // This component is not used, only the action is
}
