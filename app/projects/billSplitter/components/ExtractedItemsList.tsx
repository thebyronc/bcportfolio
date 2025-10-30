import { CloseIcon } from "~/assets";
import { useState } from "react";
import type { ExtractedItem } from './types/receiptScanner';

interface ExtractedItemsListProps {
  extractedItems: ExtractedItem[];
  onAddItem: (item: ExtractedItem) => void;
  onAddAllItems: () => void;
  onRemoveItem: (index: number) => void;
}

export function ExtractedItemsList({ 
  extractedItems, 
  onAddItem, 
  onAddAllItems, 
  onRemoveItem 
}: ExtractedItemsListProps) {
  const [addedItemKeys, setAddedItemKeys] = useState<Set<string>>(new Set());

  const getItemKey = (item: ExtractedItem) => `${item.description}|${item.amount}`;

  if (extractedItems.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Extracted Items</h3>
        <button
          onClick={onAddAllItems}
          className="rounded-md bg-green-600 px-3 py-1 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        >
          Add All
        </button>
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto">
        {extractedItems.map((item, index) => {
          const keyStr = getItemKey(item);
          const isAdded = addedItemKeys.has(keyStr);
          return (
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
                onClick={() => {
                  if (isAdded) {
                    onRemoveItem(index);
                    setAddedItemKeys(prev => {
                      const next = new Set(prev);
                      next.delete(keyStr);
                      return next;
                    });
                  } else {
                    onAddItem(item);
                    setAddedItemKeys(prev => new Set(prev).add(keyStr));
                  }
                }}
                className={
                  (isAdded
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-volt-400 hover:bg-volt-300 text-zinc-950") +
                  " rounded-md px-3 py-1 text-sm font-semibold transition-colors"
                }
              >
                {isAdded ? "Remove" : "Add"}
              </button>
              <button
                onClick={() => onRemoveItem(index)}
                className="text-zinc-300 transition-colors hover:text-white"
              >
                <CloseIcon size={16} color="currentColor" />
              </button>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}
