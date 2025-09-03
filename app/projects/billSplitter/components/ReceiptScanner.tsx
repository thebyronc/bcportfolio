import { useState, useRef } from "react";
import { useBillSplitter } from "../BillSplitterContext";
import { addLineItem as addLineItemAction } from "../billSplitterActions";

interface ExtractedItem {
  description: string;
  amount: number;
  confidence: number;
}

interface AIExtractionOptions {
  useAI: boolean;
  apiKey?: string;
  model?: string;
}

interface OCRExtractionOptions {
  useGoogleVision: boolean;
  googleApiKey?: string;
  useTesseract: boolean;
}

export function ReceiptScanner() {
  const { dispatch } = useBillSplitter();
  const [isScanning, setIsScanning] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [scanProgress, setScanProgress] = useState("");
  const [rawText, setRawText] = useState("");
  const [showRawText, setShowRawText] = useState(false);
  const [aiOptions, setAiOptions] = useState<AIExtractionOptions>({
    useAI: false,
    model: "gpt-4o-mini",
  });
  const [ocrOptions, setOcrOptions] = useState<OCRExtractionOptions>({
    useGoogleVision: true,
    googleApiKey: "",
    useTesseract: false,
  });
  const [showAISettings, setShowAISettings] = useState(false);
  const [showOCRSettings, setShowOCRSettings] = useState(false);
  const [lastScanUsedAI, setLastScanUsedAI] = useState(false);
  const [lastScanUsedGoogleVision, setLastScanUsedGoogleVision] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Google Cloud Vision OCR
  const extractWithGoogleVision = async (
    file: File,
    apiKey: string,
  ): Promise<string> => {
    try {
      // Convert file to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data:image/jpeg;base64, prefix
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });

      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: "TEXT_DETECTION",
                    maxResults: 1,
                  },
                ],
                imageContext: {
                  languageHints: ["en"],
                },
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Google Vision API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.responses[0]?.textAnnotations?.[0]?.description || "";

      if (!text) {
        throw new Error("No text detected in image");
      }

      return text;
    } catch (error) {
      console.error("Google Vision OCR error:", error);
      throw error;
    }
  };

  // Tesseract.js OCR (fallback)
  const extractWithTesseract = async (file: File): Promise<string> => {
    // Dynamic import to avoid loading Tesseract if not needed
    const { createWorker } = await import("tesseract.js");

    const worker = await createWorker("eng");

    // Configure Tesseract for receipt scanning
    await worker.setParameters({
      tessedit_char_whitelist:
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$.,()- ",
      preserve_interword_spaces: "1",
      textord_heavy_nr: "1",
      textord_min_linesize: "2.5",
      tessedit_do_invert: "0",
      tessedit_image_border: "20",
      textord_old_baselines: "0",
      textord_force_make_prop_words: "F",
      textord_old_xheight: "0",
      textord_min_xheight: "8",
      textord_old_metrics: "0",
    });

    const {
      data: { text },
    } = await worker.recognize(file);
    await worker.terminate();

    return text;
  };

  // AI-powered text extraction using OpenAI
  const extractWithAI = async (
    text: string,
    apiKey: string,
  ): Promise<ExtractedItem[]> => {
    try {
      const prompt = `You are a receipt parsing expert. Extract line items from this receipt text. Return ONLY a JSON array of objects with this exact format:
[
  {
    "description": "item name",
    "amount": 0.00,
    "confidence": 0.95
  }
]

Receipt text:
${text}

Rules:
- Only include actual line items (not totals, taxes, etc.)
- Amounts should be positive numbers
- Confidence should be 0.0-1.0 based on how clear the item is
- Skip headers, footers, and non-item text
- Return valid JSON only`;

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: aiOptions.model || "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a receipt parsing expert. Always return valid JSON arrays.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.1,
            max_tokens: 1000,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No content received from AI");
      }

      // Extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in AI response");
      }

      const items = JSON.parse(jsonMatch[0]);
      return items.map((item: any) => ({
        description: item.description || "",
        amount: parseFloat(item.amount) || 0,
        confidence: parseFloat(item.confidence) || 0.8,
      }));
    } catch (error) {
      console.error("AI extraction error:", error);
      throw error;
    }
  };

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
    setLastScanUsedAI(false);
    setLastScanUsedGoogleVision(false);

    try {
      let extractedText = "";
      let usedGoogleVision = false;

      // Choose OCR method
      if (ocrOptions.useGoogleVision && ocrOptions.googleApiKey) {
        try {
          setScanProgress("Using Google Cloud Vision for OCR...");
          extractedText = await extractWithGoogleVision(
            file,
            ocrOptions.googleApiKey,
          );
          usedGoogleVision = true;
          setScanProgress("Google Vision OCR completed successfully");
        } catch (visionError) {
          console.warn(
            "Google Vision failed, falling back to Tesseract:",
            visionError,
          );
          setScanProgress("Google Vision failed, using Tesseract...");
          extractedText = await extractWithTesseract(file);
        }
      } else if (ocrOptions.useTesseract) {
        setScanProgress("Using Tesseract.js for OCR...");
        extractedText = await extractWithTesseract(file);
      } else {
        throw new Error("No OCR method selected");
      }

      setRawText(extractedText);
      setLastScanUsedGoogleVision(usedGoogleVision);

      setScanProgress("Parsing line items...");

      let items: ExtractedItem[];
      let usedAI = false;

      // Debug logging
      console.log("AI Options:", aiOptions);
      console.log("AI Enabled:", aiOptions.useAI);
      console.log("API Key present:", !!aiOptions.apiKey);

      if (aiOptions.useAI && aiOptions.apiKey) {
        try {
          console.log("Starting AI extraction...");
          setScanProgress("Using AI to extract line items...");
          items = await extractWithAI(extractedText, aiOptions.apiKey);
          usedAI = true;
          console.log("AI extraction successful:", items);
          setScanProgress(`AI found ${items.length} line items`);
        } catch (aiError) {
          console.warn(
            "AI extraction failed, falling back to pattern matching:",
            aiError,
          );
          setScanProgress("AI extraction failed, using pattern matching...");
          items = parseReceiptText(extractedText);
        }
      } else {
        console.log("Using pattern matching (AI disabled or no API key)");
        items = parseReceiptText(extractedText);
      }

      setExtractedItems(items);
      setLastScanUsedAI(usedAI);
      setScanProgress(
        `Found ${items.length} potential line items ${usedAI ? "(AI enhanced)" : "(pattern matching)"} ${usedGoogleVision ? "(Google Vision)" : "(Tesseract)"}`,
      );
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

      {/* OCR Settings */}
      <div className="mb-4 rounded-lg bg-zinc-700 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-volt-300 text-lg font-medium">OCR Engine</h3>
          <button
            onClick={() => setShowOCRSettings(!showOCRSettings)}
            className="text-volt-400 hover:text-volt-300 text-sm underline"
          >
            {showOCRSettings ? "Hide" : "Show"} Settings
          </button>
        </div>

        {/* Quick Setup Instructions */}
        <div className="mb-4 rounded-lg border border-blue-500/30 bg-blue-900/30 p-3">
          <h4 className="mb-2 font-medium text-blue-300">
            🚀 Quick Setup for Google Vision
          </h4>
          <ol className="space-y-1 text-xs text-blue-200">
            <li>
              1. Go to{" "}
              <a
                href="https://console.cloud.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Google Cloud Console
              </a>
            </li>
            <li>2. Create a project and enable Cloud Vision API</li>
            <li>3. Create credentials → API Key</li>
            <li>4. Copy the key (starts with "AIza...") and paste it below</li>
            <li>5. Check "Use Google Cloud Vision" and test the connection!</li>
          </ol>
        </div>

        <div className="mb-3 space-y-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="useGoogleVision"
              checked={ocrOptions.useGoogleVision}
              onChange={(e) =>
                setOcrOptions((prev) => ({
                  ...prev,
                  useGoogleVision: e.target.checked,
                }))
              }
              className="text-volt-400 focus:ring-volt-400 rounded border-zinc-600 bg-zinc-800"
            />
            <label htmlFor="useGoogleVision" className="text-sm text-zinc-300">
              Use Google Cloud Vision (Recommended)
            </label>
            {ocrOptions.useGoogleVision && (
              <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-medium text-white">
                Best Quality
              </span>
            )}
          </div>

          {/* Google API Key Field - Always visible when Google Vision is enabled */}
          {ocrOptions.useGoogleVision && (
            <div className="ml-6 border-l-2 border-green-500 pl-4">
              <label
                htmlFor="googleApiKey"
                className="mb-2 block text-sm font-medium text-green-300"
              >
                🔑 Google Cloud Vision API Key
              </label>
              <input
                type="password"
                id="googleApiKey"
                placeholder="AIzaSyC... (starts with AIza)"
                value={ocrOptions.googleApiKey || ""}
                onChange={(e) =>
                  setOcrOptions((prev) => ({
                    ...prev,
                    googleApiKey: e.target.value,
                  }))
                }
                className={`w-full rounded-md border px-3 py-2 text-sm text-zinc-300 placeholder-zinc-500 focus:ring-1 focus:outline-none ${
                  ocrOptions.googleApiKey &&
                  !ocrOptions.googleApiKey.startsWith("AIza")
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-600 focus:border-green-400 focus:ring-green-400"
                } bg-zinc-800`}
              />
              {ocrOptions.googleApiKey &&
                !ocrOptions.googleApiKey.startsWith("AIza") && (
                  <p className="mt-1 text-xs text-red-400">
                    ⚠️ Google API key should start with "AIza"
                  </p>
                )}
              {ocrOptions.googleApiKey &&
                ocrOptions.googleApiKey.startsWith("AIza") && (
                  <p className="mt-1 text-xs text-green-400">
                    ✅ Valid Google API key format
                  </p>
                )}
              {!ocrOptions.googleApiKey && (
                <p className="mt-1 text-xs text-yellow-400">
                  ℹ️ Enter your Google Cloud Vision API key to enable superior
                  OCR
                </p>
              )}

              {/* Quick test button when API key is present */}
              {ocrOptions.googleApiKey &&
                ocrOptions.googleApiKey.startsWith("AIza") && (
                  <div className="mt-2">
                    <button
                      onClick={async () => {
                        try {
                          setScanProgress(
                            "Testing Google Vision connection...",
                          );
                          // Create a simple test image
                          const canvas = document.createElement("canvas");
                          canvas.width = 200;
                          canvas.height = 100;
                          const ctx = canvas.getContext("2d")!;
                          ctx.fillStyle = "white";
                          ctx.fillRect(0, 0, 200, 100);
                          ctx.fillStyle = "black";
                          ctx.font = "16px Arial";
                          ctx.fillText("Test Receipt", 10, 30);
                          ctx.fillText("Coffee $3.50", 10, 60);

                          canvas.toBlob(async (blob) => {
                            if (blob) {
                              const testFile = new File([blob], "test.png", {
                                type: "image/png",
                              });
                              const testText = await extractWithGoogleVision(
                                testFile,
                                ocrOptions.googleApiKey!,
                              );
                              setScanProgress(
                                `✅ Google Vision test successful! Detected: "${testText.substring(0, 50)}..."`,
                              );
                              setTimeout(() => setScanProgress(""), 3000);
                            }
                          });
                        } catch (error) {
                          setScanProgress(
                            `❌ Google Vision test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                          );
                          setTimeout(() => setScanProgress(""), 5000);
                        }
                      }}
                      className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      🧪 Test Google Vision Connection
                    </button>
                  </div>
                )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="useTesseract"
              checked={ocrOptions.useTesseract}
              onChange={(e) =>
                setOcrOptions((prev) => ({
                  ...prev,
                  useTesseract: e.target.checked,
                }))
              }
              className="text-volt-400 focus:ring-volt-400 rounded border-zinc-600 bg-zinc-800"
            />
            <label htmlFor="useTesseract" className="text-sm text-zinc-300">
              Use Tesseract.js (Fallback)
            </label>
          </div>
        </div>

        {showOCRSettings && (
          <div className="space-y-3">
            <div>
              <label
                htmlFor="googleApiKey"
                className="mb-1 block text-sm font-medium text-zinc-300"
              >
                Google Cloud Vision API Key
              </label>
              <input
                type="password"
                id="googleApiKey"
                placeholder="AIza..."
                value={ocrOptions.googleApiKey || ""}
                onChange={(e) =>
                  setOcrOptions((prev) => ({
                    ...prev,
                    googleApiKey: e.target.value,
                  }))
                }
                className={`w-full rounded-md border px-3 py-2 text-sm text-zinc-300 placeholder-zinc-500 focus:ring-1 focus:outline-none ${
                  ocrOptions.googleApiKey &&
                  !ocrOptions.googleApiKey.startsWith("AIza")
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "focus:border-volt-400 focus:ring-volt-400 border-zinc-600"
                } bg-zinc-800`}
              />
              {ocrOptions.googleApiKey &&
                !ocrOptions.googleApiKey.startsWith("AIza") && (
                  <p className="mt-1 text-xs text-red-400">
                    Google API key should start with "AIza"
                  </p>
                )}
            </div>

            <div className="text-xs text-zinc-400">
              <p>• Google Cloud Vision provides the best OCR accuracy</p>
              <p>• Costs approximately $0.001-0.003 per receipt</p>
              <p>• Falls back to Tesseract if Google Vision fails</p>
              <p>
                • Get API key from{" "}
                <a
                  href="https://console.cloud.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-volt-400 underline"
                >
                  Google Cloud Console
                </a>
              </p>
            </div>

            {ocrOptions.useGoogleVision && ocrOptions.googleApiKey && (
              <div className="pt-2">
                <button
                  onClick={async () => {
                    try {
                      setScanProgress("Testing Google Vision connection...");
                      // Create a simple test image
                      const canvas = document.createElement("canvas");
                      canvas.width = 200;
                      canvas.height = 100;
                      const ctx = canvas.getContext("2d")!;
                      ctx.fillStyle = "white";
                      ctx.fillRect(0, 0, 200, 100);
                      ctx.fillStyle = "black";
                      ctx.font = "16px Arial";
                      ctx.fillText("Test Receipt", 10, 30);
                      ctx.fillText("Coffee $3.50", 10, 60);

                      canvas.toBlob(async (blob) => {
                        if (blob) {
                          const testFile = new File([blob], "test.png", {
                            type: "image/png",
                          });
                          const testText = await extractWithGoogleVision(
                            testFile,
                            ocrOptions.googleApiKey!,
                          );
                          setScanProgress(
                            `Google Vision test successful! Detected: "${testText.substring(0, 50)}..."`,
                          );
                          setTimeout(() => setScanProgress(""), 3000);
                        }
                      });
                    } catch (error) {
                      setScanProgress(
                        `Google Vision test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                      );
                      setTimeout(() => setScanProgress(""), 5000);
                    }
                  }}
                  className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  🧪 Test Google Vision
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Settings */}
      <div className="mb-4 rounded-lg bg-zinc-700 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-volt-300 text-lg font-medium">AI Enhancement</h3>
          <button
            onClick={() => setShowAISettings(!showAISettings)}
            className="text-volt-400 hover:text-volt-300 text-sm underline"
          >
            {showAISettings ? "Hide" : "Show"} Settings
          </button>
        </div>

        <div className="mb-3 flex items-center gap-3">
          <input
            type="checkbox"
            id="useAI"
            checked={aiOptions.useAI}
            onChange={(e) =>
              setAiOptions((prev) => ({ ...prev, useAI: e.target.checked }))
            }
            className="text-volt-400 focus:ring-volt-400 rounded border-zinc-600 bg-zinc-800"
          />
          <label htmlFor="useAI" className="text-sm text-zinc-300">
            Use AI to improve text extraction
          </label>
          {aiOptions.useAI && (
            <span className="bg-volt-400 rounded-full px-2 py-1 text-xs font-medium text-zinc-950">
              AI Enabled
            </span>
          )}
        </div>

        {showAISettings && (
          <div className="space-y-3">
            <div>
              <label
                htmlFor="apiKey"
                className="mb-1 block text-sm font-medium text-zinc-300"
              >
                OpenAI API Key
              </label>
              <input
                type="password"
                id="apiKey"
                placeholder="sk-..."
                value={aiOptions.apiKey || ""}
                onChange={(e) =>
                  setAiOptions((prev) => ({ ...prev, apiKey: e.target.value }))
                }
                className={`w-full rounded-md border px-3 py-2 text-sm text-zinc-300 placeholder-zinc-500 focus:ring-1 focus:outline-none ${
                  aiOptions.apiKey && !aiOptions.apiKey.startsWith("sk-")
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "focus:border-volt-400 focus:ring-volt-400 border-zinc-600"
                } bg-zinc-800`}
              />
              {aiOptions.apiKey && !aiOptions.apiKey.startsWith("sk-") && (
                <p className="mt-1 text-xs text-red-400">
                  API key should start with "sk-"
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="model"
                className="mb-1 block text-sm font-medium text-zinc-300"
              >
                AI Model
              </label>
              <select
                id="model"
                value={aiOptions.model}
                onChange={(e) =>
                  setAiOptions((prev) => ({ ...prev, model: e.target.value }))
                }
                className="focus:border-volt-400 focus:ring-volt-400 w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-300 focus:ring-1 focus:outline-none"
              >
                <option value="gpt-4o-mini">GPT-4o Mini (Fast & Cheap)</option>
                <option value="gpt-4o">GPT-4o (Best Quality)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Budget)</option>
              </select>
            </div>

            <div className="text-xs text-zinc-400">
              <p>• AI enhancement requires an OpenAI API key</p>
              <p>• Costs approximately $0.001-0.01 per receipt</p>
              <p>• Falls back to pattern matching if AI fails</p>
            </div>

            {aiOptions.useAI && aiOptions.apiKey && (
              <div className="pt-2">
                <button
                  onClick={async () => {
                    try {
                      setScanProgress("Testing AI connection...");
                      const testItems = await extractWithAI(
                        "Test receipt: Coffee $3.50, Sandwich $8.99",
                        aiOptions.apiKey!,
                      );
                      setScanProgress(
                        `AI test successful! Found ${testItems.length} items`,
                      );
                      setTimeout(() => setScanProgress(""), 3000);
                    } catch (error) {
                      setScanProgress(
                        `AI test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                      );
                      setTimeout(() => setScanProgress(""), 5000);
                    }
                  }}
                  className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  🧪 Test AI Connection
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
        <div className="mb-4 flex items-center gap-2 text-sm">
          {aiOptions.useAI && scanProgress.includes("AI") && (
            <div className="bg-volt-400 h-3 w-3 animate-pulse rounded-full"></div>
          )}
          <span
            className={
              aiOptions.useAI && scanProgress.includes("AI")
                ? "text-volt-300"
                : "text-zinc-400"
            }
          >
            {scanProgress}
          </span>
          {lastScanUsedAI && (
            <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-medium text-white">
              ✓ AI Used
            </span>
          )}
          {lastScanUsedGoogleVision && (
            <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
              ✓ Google Vision
            </span>
          )}
        </div>
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
                  <div className="flex items-center gap-2">
                    <p className="text-volt-400 font-semibold">
                      ${item.amount.toFixed(2)}
                    </p>
                    {aiOptions.useAI && (
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          item.confidence >= 0.9
                            ? "bg-green-600 text-white"
                            : item.confidence >= 0.7
                              ? "bg-yellow-600 text-white"
                              : "bg-red-600 text-white"
                        }`}
                      >
                        {Math.round(item.confidence * 100)}%
                      </span>
                    )}
                  </div>
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
        {ocrOptions.useGoogleVision && (
          <div className="mt-2 rounded border-l-2 border-blue-400 bg-zinc-700 p-2">
            <p className="font-medium text-blue-300">
              Google Vision OCR Active
            </p>
            <p className="text-zinc-400">
              Using Google Cloud Vision for superior text recognition
            </p>
          </div>
        )}
        {aiOptions.useAI && (
          <div className="border-volt-400 mt-2 rounded border-l-2 bg-zinc-700 p-2">
            <p className="text-volt-300 font-medium">AI Enhancement Active</p>
            <p className="text-zinc-400">
              Using {aiOptions.model} to improve text extraction accuracy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
