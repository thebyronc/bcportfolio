import type { ExtractedItem } from '../types/receiptScanner';

/**
 * Convert file to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix if present (data:image/type;base64,)
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Fallback function to extract items from text using simple parsing
 */
export const extractItemsFromText = (text: string): ExtractedItem[] => {
  const lines = text.split('\n').filter(line => line.trim());
  const items: ExtractedItem[] = [];
  
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
};

/**
 * Generate unique ID for items
 */
export const generateItemId = (baseTime: number, index: number): string => {
  return (baseTime + index).toString();
};
