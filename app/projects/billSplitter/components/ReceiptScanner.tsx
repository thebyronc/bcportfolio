import { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { useBillSplitter } from "../BillSplitterContext";
import { addLineItem as addLineItemAction } from "../billSplitterActions";

interface ExtractedItem {
  description: string;
  amount: number;
  confidence: number;
}

export function ReceiptScanner() {
  const { dispatch } = useBillSplitter();
  const [isScanning, setIsScanning] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [scanProgress, setScanProgress] = useState("");
  const [rawText, setRawText] = useState("");
  const [showRawText, setShowRawText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseReceiptText = (text: string): ExtractedItem[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    const items: ExtractedItem[] = [];

    // Enhanced patterns for receipt line items with better coverage
    const patterns = [
      // Standard patterns
      /^(.+?)\s+\$?(\d+\.\d{2})$/,
      /^(.+?)\s+\$(\d+\.\d{2})$/,
      /^(.+?)\s+(\d+\.\d{2})$/,
      /^(.+?)\s+(\d+\.\d{2})\s*\$$/,
      /^(.+?)\s+\$?(\d+\.\d{2})$/,

      // Patterns with quantity
      /^(.+?)\s+\d+\s+\$?(\d+\.\d{2})$/,
      /^\d+\s+(.+?)\s+\$?(\d+\.\d{2})$/,

      // Patterns with spaces in amounts (common OCR issue)
      /^(.+?)\s+\$?(\d+)\s*\.\s*(\d{2})$/,
      /^(.+?)\s+(\d+)\s*\.\s*(\d{2})$/,

      // Patterns with missing decimal points
      /^(.+?)\s+\$?(\d{3,4})$/,
      /^(.+?)\s+(\d{3,4})$/,

      // Patterns with extra spaces
      /^(.+?)\s+\$?\s*(\d+\.\d{2})$/,
      /^(.+?)\s+\s+\$?(\d+\.\d{2})$/,

      // Patterns with different price formats
      /^(.+?)\s+\$?(\d+)\.(\d{2})$/,
      /^(.+?)\s+(\d+)\.(\d{2})$/,

      // Patterns for items without dollar signs
      /^(.+?)\s+(\d+\.\d{2})\s*$/,

      // Patterns with parentheses (common in receipts)
      /^(.+?)\s*\([^)]*\)\s+\$?(\d+\.\d{2})$/,
      /^(.+?)\s+\$?(\d+\.\d{2})\s*\([^)]*\)$/,

      // Patterns for items with asterisks or special characters
      /^(.+?)\s*\*\s+\$?(\d+\.\d{2})$/,
      /^(.+?)\s+\$?(\d+\.\d{2})\s*\*$/,

      // Patterns for items with dashes or hyphens
      /^(.+?)\s*-\s+\$?(\d+\.\d{2})$/,
      /^(.+?)\s+\$?(\d+\.\d{2})\s*-$/,

      // Patterns for items with @ symbol (common in receipts)
      /^(.+?)\s*@\s+\$?(\d+\.\d{2})$/,
      /^(.+?)\s+\$?(\d+\.\d{2})\s*@$/,
    ];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Stop processing after encountering "Total" (case insensitive)
      if (trimmedLine.toLowerCase().includes("total")) {
        break;
      }

      // Skip common receipt headers/footers
      if (
        trimmedLine.toLowerCase().includes("subtotal") ||
        trimmedLine.toLowerCase().includes("tax") ||
        trimmedLine.toLowerCase().includes("tip") ||
        trimmedLine.toLowerCase().includes("change") ||
        trimmedLine.toLowerCase().includes("cash") ||
        trimmedLine.toLowerCase().includes("card") ||
        trimmedLine.toLowerCase().includes("receipt") ||
        trimmedLine.toLowerCase().includes("thank") ||
        trimmedLine.toLowerCase().includes("date") ||
        trimmedLine.toLowerCase().includes("time") ||
        trimmedLine.toLowerCase().includes("store") ||
        trimmedLine.toLowerCase().includes("address") ||
        trimmedLine.toLowerCase().includes("phone") ||
        trimmedLine.toLowerCase().includes("www") ||
        trimmedLine.toLowerCase().includes("http") ||
        trimmedLine.toLowerCase().includes("visa") ||
        trimmedLine.toLowerCase().includes("mastercard") ||
        trimmedLine.toLowerCase().includes("amex") ||
        trimmedLine.toLowerCase().includes("discover") ||
        trimmedLine.toLowerCase().includes("balance") ||
        trimmedLine.toLowerCase().includes("due") ||
        trimmedLine.toLowerCase().includes("amount") ||
        trimmedLine.toLowerCase().includes("payment") ||
        trimmedLine.length < 3
      ) {
        continue;
      }

      for (const pattern of patterns) {
        const match = trimmedLine.match(pattern);
        if (match) {
          let description = match[1].trim();
          let amount: number;

          // Handle patterns with split decimal points
          if (match[3]) {
            amount = parseFloat(`${match[2]}.${match[3]}`);
          } else {
            amount = parseFloat(match[2]);
          }

          // Handle patterns where amount might be missing decimal point
          if (amount > 100 && amount < 10000) {
            // Likely missing decimal point, convert to cents
            amount = amount / 100;
          }

          // Validate the amount
          if (amount > 0 && amount < 10000) {
            // Clean up description
            description = description
              .replace(/[^\w\s\-\.]/g, " ")
              .replace(/\s+/g, " ")
              .trim();

            // Skip if description is too short
            if (description.length < 2) continue;

            items.push({
              description,
              amount,
              confidence: 0.8, // Default confidence for pattern matches
            });
            break;
          }
        }
      }
    }

    // Remove duplicates based on description and amount
    const uniqueItems = items.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.description.toLowerCase() === item.description.toLowerCase() &&
            Math.abs(t.amount - item.amount) < 0.01,
        ),
    );

    return uniqueItems;
  };

  const scanReceipt = async (file: File) => {
    setIsScanning(true);
    setScanProgress("Initializing OCR...");
    setExtractedItems([]);

    try {
      // Create worker with enhanced configuration for receipts
      const worker = await createWorker("eng");

      // Configure Tesseract for receipt scanning
      await worker.setParameters({
        tessedit_char_whitelist:
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$.,()- ",
        preserve_interword_spaces: "1",
        textord_heavy_nr: "1", // Better handling of noise
        textord_min_linesize: "2.5", // Minimum line size
        tessedit_do_invert: "0", // Don't invert colors
        tessedit_image_border: "20", // Add border for better recognition
        textord_old_baselines: "0", // Use new baseline detection
        textord_force_make_prop_words: "F", // Don't force proportional words
        textord_old_xheight: "0", // Use new x-height calculation
        textord_min_xheight: "8", // Minimum x-height
        textord_old_metrics: "0", // Use new metrics
      });

      setScanProgress("Processing image with enhanced OCR...");

      // First pass with default settings
      const {
        data: { text: text1 },
      } = await worker.recognize(file);

      // Second pass with different configuration for better line detection
      await worker.setParameters({
        preserve_interword_spaces: "1",
        textord_heavy_nr: "1",
        textord_min_linesize: "1.5", // Smaller line size for better detection
      });

      const {
        data: { text: text2 },
      } = await worker.recognize(file);

      // Third pass with different configuration for sparse text
      await worker.setParameters({
        preserve_interword_spaces: "1",
        textord_heavy_nr: "0", // Less noise removal for sparse text
        textord_min_linesize: "1.0", // Even smaller line size
      });

      const {
        data: { text: text3 },
      } = await worker.recognize(file);

      // Combine all OCR results
      const combinedText = `${text1}\n${text2}\n${text3}`;
      setRawText(combinedText);

      setScanProgress("Parsing line items...");
      const items = parseReceiptText(combinedText);

      setExtractedItems(items);
      setScanProgress(`Found ${items.length} potential line items`);

      await worker.terminate();
    } catch (error) {
      console.error("OCR Error:", error);
      setScanProgress("Error processing image. Please try again.");
    } finally {
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
    <div className="rounded-lg bg-zinc-800 p-6">
      <h2 className="text-volt-400 mb-4 text-xl font-semibold">
        Receipt Scanner
      </h2>

      <div className="mb-4">
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
              <pre className="whitespace-pre-wrap">{rawText}</pre>
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
