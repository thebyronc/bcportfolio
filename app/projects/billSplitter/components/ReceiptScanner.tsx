import { useState, useRef, useEffect } from "react";
import { useFetcher } from "react-router";
import { useBillSplitter } from "../BillSplitterContext";
import { addLineItem as addLineItemAction } from "../billSplitterActions";

interface ExtractedItem {
  description: string;
  amount: number;
  confidence: number;
}

// Image preprocessing helper functions
const preprocessImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) {
          reject(new Error('Could not get image data'));
          return;
        }
        
        const data = imageData.data;
        preprocessImageData(data, canvas.width, canvas.height);
        ctx?.putImageData(imageData, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const processedFile = new File([blob], file.name, { type: file.type });
            resolve(processedFile);
          } else {
            reject(new Error('Could not create processed image'));
          }
        }, file.type, 0.95);
        
        URL.revokeObjectURL(img.src);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = URL.createObjectURL(file);
  });
};

const preprocessImageData = (data: Uint8ClampedArray, width: number, height: number) => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    const enhanced = enhanceContrast(gray);
    data[i] = enhanced;
    data[i + 1] = enhanced;
    data[i + 2] = enhanced;
  }
  applyNoiseReduction(data, width, height);
  applyEdgeSharpening(data, width, height);
};

const enhanceContrast = (value: number): number => {
  const gamma = 1.2;
  const contrast = 1.3;
  let enhanced = Math.pow(value / 255, 1 / gamma) * 255;
  enhanced = (enhanced - 128) * contrast + 128;
  return Math.max(0, Math.min(255, Math.round(enhanced)));
};

const applyNoiseReduction = (data: Uint8ClampedArray, width: number, height: number) => {
  const temp = new Uint8ClampedArray(data);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const neighbors = [];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nIdx = ((y + dy) * width + (x + dx)) * 4;
          neighbors.push(temp[nIdx]);
        }
      }
      neighbors.sort((a, b) => a - b);
      const median = neighbors[4];
      data[idx] = median;
      data[idx + 1] = median;
      data[idx + 2] = median;
    }
  }
};

const applyEdgeSharpening = (data: Uint8ClampedArray, width: number, height: number) => {
  const temp = new Uint8ClampedArray(data);
  const kernel = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      let sum = 0;
      for (let ky = 0; ky < 3; ky++) {
        for (let kx = 0; kx < 3; kx++) {
          const nIdx = ((y + ky - 1) * width + (x + kx - 1)) * 4;
          sum += temp[nIdx] * kernel[ky][kx];
        }
      }
      const sharpened = Math.max(0, Math.min(255, sum));
      data[idx] = sharpened;
      data[idx + 1] = sharpened;
      data[idx + 2] = sharpened;
    }
  }
};

export function ReceiptScanner() {
  const { dispatch } = useBillSplitter();
  const fetcher = useFetcher();
  const [isScanning, setIsScanning] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [scanProgress, setScanProgress] = useState("");
  const [rawText, setRawText] = useState("");
  const [showRawText, setShowRawText] = useState(false);
  const [showPreprocessedImage, setShowPreprocessedImage] = useState(false);
  const [preprocessedImageUrl, setPreprocessedImageUrl] = useState<string>("");
  const [enablePreprocessing, setEnablePreprocessing] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.error) {
        setScanProgress(`Error: ${fetcher.data.error}`);
        setIsScanning(false);
      } else {
        // Ensure text is a string before setting it
        const textValue = typeof fetcher.data.text === 'string' ? fetcher.data.text : String(fetcher.data.text || '');
        setRawText(textValue);
        setScanProgress("Processing extracted data...");
        
        // Convert Gemini results to our format
        const items: ExtractedItem[] = (fetcher.data.items || []).map((item: any) => ({
          description: item.description,
          amount: item.amount,
          confidence: item.confidence
        }));
        
        setExtractedItems(items);
        setScanProgress(`Found ${items.length} line items using Gemini AI`);
        setIsScanning(false);
      }
    }
  }, [fetcher.data]);

  // Handle fetcher errors
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data === undefined && isScanning) {
      setScanProgress("Error: Failed to process image");
      setIsScanning(false);
    }
  }, [fetcher.state, fetcher.data, isScanning]);


  const scanReceipt = async (file: File) => {
    setIsScanning(true);
    setScanProgress("Preprocessing image...");
    setExtractedItems([]);
    setPreprocessedImageUrl("");

    try {
      let fileToProcess = file;
      console.log('fileToProcess', fileToProcess);
      // Preprocess the image if enabled
      if (enablePreprocessing) {
        const processedFile = await preprocessImage(file);
        fileToProcess = processedFile;
        
        // Create URL for preview
        const url = URL.createObjectURL(processedFile);
        setPreprocessedImageUrl(url);
        setScanProgress("Image preprocessed, processing with AI...");
      } else {
        setScanProgress("Processing with AI...");
      }

      // Use Gemini for OCR via React Router fetcher (SSR)
      setScanProgress("Analyzing receipt with Gemini AI...");
      
      const formData = new FormData();
      formData.append('image', fileToProcess);
      console.log('formData', formData);
      fetcher.submit(formData, {
        method: 'POST',
        action: 'api/ocr'
      });

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

  const addExtractedItem = (item: ExtractedItem) => {
    const newItem = {
      id: Date.now().toString(),
      description: item.description,
      amount: item.amount,
      assignedTo: [],
    };
    dispatch(addLineItemAction(newItem));
  };

  const addAllItems = () => {
    extractedItems.forEach((item) => {
      addExtractedItem(item);
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
        {/* Preprocessing Options */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={enablePreprocessing}
              onChange={(e) => setEnablePreprocessing(e.target.checked)}
              className="rounded border-zinc-600 bg-zinc-700 text-volt-400 focus:ring-volt-400"
            />
            Enable image preprocessing
          </label>
        </div>

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

      {rawText && (
        <div className="mb-4">
          <button
            onClick={() => setShowRawText(!showRawText)}
            className="text-volt-400 hover:text-volt-300 text-sm underline"
          >
            {showRawText ? "Hide" : "Show"} Raw OCR Text
          </button>
          {showRawText && (
            <div className="mt-2 max-h-32 overflow-y-auto rounded-md bg-zinc-700 p-3 text-xs text-zinc-300">
              <pre className="whitespace-pre-wrap">{typeof rawText === 'string' ? rawText : String(rawText)}</pre>
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
