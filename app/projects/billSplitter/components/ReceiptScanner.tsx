import { useState, useRef } from "react";
import { useBillSplitter } from "../BillSplitterContext";
import { addLineItem as addLineItemAction } from "../billSplitterActions";

interface ExtractedItem {
  description: string;
  amount: number;
  confidence: number;
}

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
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


export function ReceiptScanner() {
  const { dispatch } = useBillSplitter();
  const [isScanning, setIsScanning] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [scanProgress, setScanProgress] = useState("");
  const [rawText, setRawText] = useState("");
  const [showJsonResponse, setShowJsonResponse] = useState(false);
  const [jsonResponse, setJsonResponse] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const scanReceipt = async (file: File) => {
    setIsScanning(true);
    setScanProgress("Converting image to base64...");
    setExtractedItems([]);

    try {
      console.log('Processing file:', file);
      
      // Convert file to base64 on client side
      const base64String = await fileToBase64(file);
      
      setScanProgress("Analyzing receipt...");
      
      // Call Firebase Function directly
      const response = await fetch('https://us-central1-bcportfolio-9dcc7.cloudfunctions.net/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64Image: base64String,
          mimeType: file.type || 'image/jpeg'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        setScanProgress(`Error: ${data.error}`);
        setIsScanning(false);
      } else {
        // Ensure text is a string before setting it
        const textValue = typeof data.text === 'string' ? data.text : String(data.text || '');
        setRawText(textValue);
        setJsonResponse(data);
        setScanProgress("Processing extracted data...");
        
        // Convert results to our format
        const items: ExtractedItem[] = (data.items || []).map((item: any) => ({
          description: item.description,
          amount: item.amount,
          confidence: item.confidence
        }));
        
        setExtractedItems(items);
        setScanProgress(`Found ${items.length} line items`);
        setIsScanning(false);
      }

    } catch (error) {
      console.error("OCR Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setScanProgress(`Error: ${errorMessage}`);
      setIsScanning(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      scanReceipt(file);
    }
  };

  const addExtractedItem = (item: ExtractedItem, customId?: string) => {
    const newItem = {
      id: customId || Date.now().toString(),
      description: item.description,
      amount: item.amount,
      assignedTo: [],
    };
    dispatch(addLineItemAction(newItem));
  };

  const addAllItems = () => {
    const baseTime = Date.now();
    extractedItems.forEach((item, index) => {
      // Generate unique ID by adding index to base time
      const uniqueId = (baseTime + index).toString();
      addExtractedItem(item, uniqueId);
    });
    setExtractedItems([]);
  };

  const removeItem = (index: number) => {
    setExtractedItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-lg bg-zinc-800 p-4 sm:p-6">
      <h2 className="text-volt-400 mb-4 text-xl font-semibold">
        Receipt Scanner
      </h2>

      <div className="mb-4 space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
          className="bg-volt-400 hover:bg-volt-300 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold text-zinc-950 transition-colors disabled:cursor-not-allowed disabled:bg-zinc-600"
        >
          {isScanning ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-zinc-950"></div>
              Scanning...
            </>
          ) : (
            <>📷 Upload Receipt Image</>
          )}
        </button>
      </div>

      {scanProgress && (
        <div className="mb-4 text-sm text-zinc-400">{scanProgress}</div>
      )}

      {jsonResponse && (
        <div className="mb-4">
          <button
            onClick={() => setShowJsonResponse(!showJsonResponse)}
            className="text-volt-400 hover:text-volt-300 text-sm underline"
          >
            {showJsonResponse ? "Hide" : "Show"} JSON Response
          </button>
          {showJsonResponse && (
            <div className="mt-2 max-h-64 overflow-y-auto rounded-md bg-zinc-700 p-3 text-xs text-zinc-300">
              <pre className="whitespace-pre-wrap">{JSON.stringify(jsonResponse, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {extractedItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Extracted Items</h3>
            <button
              onClick={addAllItems}
              className="rounded-md bg-green-600 px-3 py-1 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Add All
            </button>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {extractedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md bg-zinc-700 p-3"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.description}</p>
                  <p className="text-volt-400 font-semibold">
                    ${item.amount.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addExtractedItem(item)}
                    className="bg-volt-400 hover:bg-volt-300 rounded-md px-3 py-1 text-sm font-semibold text-zinc-950 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-400 transition-colors hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-zinc-500">
        <p>Supported formats: JPEG, PNG, GIF, BMP</p>
        <p>
          For best results, ensure the receipt is well-lit and clearly visible
        </p>
      </div>
    </div>
  );
}
