import { GoogleGenerativeAI } from '@google/generative-ai';

// Server-side API key access (secure)
const getApiKey = () => {
  // In React Router v7, environment variables are available in server context
  if (typeof process !== 'undefined' && process.env) {
    return process.env.GOOGLE_AI_API_KEY || '';
  }
  return '';
};

export async function loader() {
  return { message: 'OCR API endpoint' };
}

export async function action({ request }: { request: Request }) {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.error('Google AI API key not found in environment variables');
      return { error: 'Google AI API key not found' };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const formData = await request.formData();
    
    // Get base64 image and MIME type from form data
    const base64Image = formData.get('base64Image') as string;
    const mimeType = formData.get('mimeType') as string;

    if (!base64Image) {
      console.error('No base64 image found in form data');
      return { error: 'No image provided' };
    }

    console.log('Processing base64 image:', {
      base64Length: base64Image.length,
      mimeType: mimeType || 'not provided'
    });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
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

    // Determine MIME type - use provided or detect from base64
    let finalMimeType = mimeType;
    
    if (!finalMimeType || finalMimeType.trim() === '') {
      // Try to detect MIME type from base64 data
      if (base64Image.startsWith('/9j/') || base64Image.startsWith('/9j4AAQ')) {
        finalMimeType = 'image/jpeg';
      } else if (base64Image.startsWith('iVBORw0KGgo')) {
        finalMimeType = 'image/png';
      } else if (base64Image.startsWith('R0lGOD')) {
        finalMimeType = 'image/gif';
      } else if (base64Image.startsWith('UklGR')) {
        finalMimeType = 'image/webp';
      } else {
        finalMimeType = 'image/jpeg'; // Default fallback
      }
      console.log('Detected MIME type:', finalMimeType);
    }
    
    console.log('Sending request to Gemini API with MIME type:', finalMimeType);
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: finalMimeType
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
