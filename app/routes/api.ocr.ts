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
    
    // Debug: Log all FormData entries
    console.log('FormData entries:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, {
        type: typeof value,
        constructor: value?.constructor?.name,
        isFile: value instanceof File,
        hasArrayBuffer: value instanceof File ? typeof value.arrayBuffer === 'function' : false
      });
    }
    
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      console.error('No image file found in form data');
      return { error: 'No image provided' };
    }

    console.log('Processing image file:', {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size,
      constructor: imageFile.constructor.name
    });

    // Validate file type
    // if (!imageFile.type || !imageFile.type.startsWith('image/')) {
    //   console.error('Invalid file type:', imageFile.type);
    //   return { error: 'Please upload a valid image file' };
    // }

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

    // Convert file to base64 with proper type checking
    let base64Image: string;
    try {
      console.log('File object methods available:', {
        hasArrayBuffer: typeof imageFile.arrayBuffer === 'function',
        hasStream: typeof imageFile.stream === 'function',
        hasText: typeof imageFile.text === 'function',
        isFile: imageFile instanceof File,
        constructor: imageFile.constructor.name
      });

      if (typeof imageFile.arrayBuffer === 'function') {
        // Standard File object
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        base64Image = buffer.toString('base64');
        console.log('Converted image to base64 using arrayBuffer, length:', base64Image.length);
      } else if (typeof imageFile.stream === 'function') {
        // File object with stream method
        const stream = imageFile.stream();
        const reader = stream.getReader();
        const chunks: Uint8Array[] = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        
        const buffer = Buffer.from(combined);
        base64Image = buffer.toString('base64');
        console.log('Converted image to base64 using stream, length:', base64Image.length);
      } else {
        // Fallback: try to access data directly
        console.log('Trying direct data access...');
        console.log('File object keys:', Object.keys(imageFile));
        
        if ((imageFile as any).data) {
          const buffer = Buffer.from((imageFile as any).data);
          base64Image = buffer.toString('base64');
          console.log('Converted image to base64 using .data property, length:', base64Image.length);
        } else if ((imageFile as any).buffer) {
          const buffer = Buffer.from((imageFile as any).buffer);
          base64Image = buffer.toString('base64');
          console.log('Converted image to base64 using .buffer property, length:', base64Image.length);
        } else if (typeof imageFile === 'string') {
          const buffer = Buffer.from(imageFile, 'binary');
          base64Image = buffer.toString('base64');
          console.log('Converted image to base64 from string, length:', base64Image.length);
        } else {
          throw new Error('Unable to extract file data - no supported methods found');
        }
      }
    } catch (error) {
      console.error('Error converting image to base64:', error);
      console.error('File object details:', {
        type: typeof imageFile,
        constructor: imageFile?.constructor?.name,
        keys: imageFile ? Object.keys(imageFile) : 'null/undefined'
      });
      return { error: 'Failed to process image file - could not extract file data' };
    }
    
    // Determine MIME type - if file is a string, we need to detect it
    let mimeType = imageFile.type;
    
    if (!mimeType || typeof imageFile === 'string') {
      // Try to detect MIME type from base64 data or default to JPEG
      if (base64Image.startsWith('/9j/') || base64Image.startsWith('/9j4AAQ')) {
        mimeType = 'image/jpeg';
      } else if (base64Image.startsWith('iVBORw0KGgo')) {
        mimeType = 'image/png';
      } else if (base64Image.startsWith('R0lGOD')) {
        mimeType = 'image/gif';
      } else if (base64Image.startsWith('UklGR')) {
        mimeType = 'image/webp';
      } else {
        mimeType = 'image/jpeg'; // Default fallback
      }
      console.log('Detected/assigned MIME type:', mimeType);
    }
    
    // Final validation - ensure MIME type is never empty
    if (!mimeType || mimeType.trim() === '') {
      console.error('MIME type is empty, defaulting to image/jpeg');
      mimeType = 'image/jpeg';
    }
    
    console.log('Sending request to Gemini API with MIME type:', mimeType);
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
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
