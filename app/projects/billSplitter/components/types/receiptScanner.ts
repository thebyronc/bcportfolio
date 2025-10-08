export interface ExtractedItem {
  description: string;
  amount: number;
  confidence: number;
}

export type InputMode = 'image' | 'text';

export interface ReceiptProcessingState {
  isScanning: boolean;
  extractedItems: ExtractedItem[];
  scanProgress: string;
  rawText: string;
  showJsonResponse: boolean;
  jsonResponse: any;
  inputMode: InputMode;
  manualText: string;
}

export interface ReceiptProcessingActions {
  setIsScanning: (value: boolean) => void;
  setExtractedItems: (items: ExtractedItem[]) => void;
  setScanProgress: (progress: string) => void;
  setRawText: (text: string) => void;
  setShowJsonResponse: (show: boolean) => void;
  setJsonResponse: (response: any) => void;
  setInputMode: (mode: InputMode) => void;
  setManualText: (text: string) => void;
}
