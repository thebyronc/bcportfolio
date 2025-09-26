import { GoogleGenerativeAI } from '@google/generative-ai';
import test64 from '../projects/billSplitter/components/test64';
// Server-side API key access (secure)
const getApiKey = () => {
  // In React Router v7, environment variables are available in server context
  if (typeof process !== 'undefined' && process.env) {
    return process.env.GOOGLE_AI_API_KEY || '';
  }
  return '';
};

export async function loader() {
  return { message: 'OCR API Test endpoint' };
}

const cleanBase64 = (base64String: string) => {
  // Remove data URL prefix if present
  if (base64String.includes(',')) {
    return base64String.split(',')[1];
  }
  return base64String;
};

export async function action({ request }: { request: Request }) {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.error('Google AI API key not found in environment variables');
      return { error: 'Google AI API key not found' };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const formData = await request.formData();
    
    
    const imageFile = formData.get('image') as File;
    console.log('imageFile', imageFile);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Analyze this receipt image and extract all line items with their prices. Return the data in this exact JSON format:
    {
      "rawText": "the complete extracted text from the receipt",
      "items": [
        {
          "description": "item name",
          "amount": 12.99,
          "confidence": 0.95
        }
      ]
    }`;

    // Convert file to base64
    const base64Image = cleanBase64(test64);
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/base64'
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    console.log('Received response from Gemini API, length:', text.length);
    
    // Try to parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          text: parsed.rawText || text,
          items: parsed.items || []
        };
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return { text: text, items: [] };
      }
    }
    
    return { text: text, items: [] };
  } catch (error) {
    console.error('Server-side OCR Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { error: `Failed to process image: ${errorMessage}` };
  }
}

// Default export for React Router
export default function ApiOcr() {
  return null; // This component is not used, only the action is
}
