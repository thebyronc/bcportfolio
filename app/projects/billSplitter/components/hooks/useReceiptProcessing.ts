import { useState, useRef } from 'react';
import { useBillSplitter } from '../../BillSplitterContext';
import { addLineItem as addLineItemAction } from '../../billSplitterActions';
import { fileToBase64, extractItemsFromText, generateItemId } from '../utils/receiptUtils';
import type { ExtractedItem, ReceiptProcessingState, ReceiptProcessingActions } from '../types/receiptScanner';

export function useReceiptProcessing() {
  const { dispatch } = useBillSplitter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<ReceiptProcessingState>({
    isScanning: false,
    extractedItems: [],
    scanProgress: '',
    rawText: '',
    showJsonResponse: false,
    jsonResponse: null,
    inputMode: 'image',
    manualText: '',
  });

  const actions: ReceiptProcessingActions = {
    setIsScanning: (value) => setState(prev => ({ ...prev, isScanning: value })),
    setExtractedItems: (items) => setState(prev => ({ ...prev, extractedItems: items })),
    setScanProgress: (progress) => setState(prev => ({ ...prev, scanProgress: progress })),
    setRawText: (text) => setState(prev => ({ ...prev, rawText: text })),
    setShowJsonResponse: (show) => setState(prev => ({ ...prev, showJsonResponse: show })),
    setJsonResponse: (response) => setState(prev => ({ ...prev, jsonResponse: response })),
    setInputMode: (mode) => setState(prev => ({ ...prev, inputMode: mode })),
    setManualText: (text) => setState(prev => ({ ...prev, manualText: text })),
  };

  const scanReceipt = async (file: File) => {
    actions.setIsScanning(true);
    actions.setScanProgress("Converting image to base64...");
    actions.setExtractedItems([]);

    try {
      console.log('Processing file:', file);
      
      // Convert file to base64 on client side
      const base64String = await fileToBase64(file);
      
      actions.setScanProgress("Analyzing receipt...");
      
      // Call Firebase Function directly
      const response = await fetch(`${import.meta.env.VITE_FUNCTIONS_URL}/ocr`, {
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
        actions.setScanProgress(`Error: ${data.error}`);
        actions.setIsScanning(false);
      } else {
        // Ensure text is a string before setting it
        const textValue = typeof data.text === 'string' ? data.text : String(data.text || '');
        actions.setRawText(textValue);
        actions.setJsonResponse(data);
        actions.setScanProgress("Processing extracted data...");
        
        // Convert results to our format
        const items: ExtractedItem[] = (data.items || []).map((item: any) => ({
          description: item.description,
          amount: item.amount,
          confidence: item.confidence
        }));
        
        actions.setExtractedItems(items);
        actions.setScanProgress(`Found ${items.length} line items`);
        actions.setIsScanning(false);
      }

    } catch (error) {
      console.error("OCR Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      actions.setScanProgress(`Error: ${errorMessage}`);
      actions.setIsScanning(false);
    }
  };

  const processManualText = async () => {
    if (!state.manualText.trim()) return;
    
    actions.setIsScanning(true);
    actions.setScanProgress("Processing text input...");
    actions.setExtractedItems([]);
    
    try {
      // Call Firebase Function for text processing
      const response = await fetch(`${import.meta.env.VITE_FUNCTIONS_URL}/textProcessor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: state.manualText
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        actions.setScanProgress(`Error: ${data.error}`);
        actions.setIsScanning(false);
      } else {
        // Ensure text is a string before setting it
        const textValue = typeof data.text === 'string' ? data.text : String(data.text || '');
        actions.setRawText(textValue);
        actions.setJsonResponse(data);
        actions.setScanProgress("Processing extracted data...");
        
        // Convert results to our format
        const items: ExtractedItem[] = (data.items || []).map((item: any) => ({
          description: item.description,
          amount: item.amount,
          confidence: item.confidence
        }));
        
        actions.setExtractedItems(items);
        actions.setScanProgress(`Found ${items.length} line items`);
        actions.setIsScanning(false);
      }

    } catch (error) {
      console.error("Text Processing Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      actions.setScanProgress(`Error: ${errorMessage}`);
      actions.setIsScanning(false);
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
    state.extractedItems.forEach((item, index) => {
      // Generate unique ID by adding index to base time
      const uniqueId = generateItemId(baseTime, index);
      addExtractedItem(item, uniqueId);
    });
    actions.setExtractedItems([]);
  };

  const removeItem = (index: number) => {
    actions.setExtractedItems(state.extractedItems.filter((_, i) => i !== index));
  };

  return {
    state,
    actions,
    fileInputRef,
    scanReceipt,
    processManualText,
    handleFileSelect,
    addExtractedItem,
    addAllItems,
    removeItem,
  };
}
