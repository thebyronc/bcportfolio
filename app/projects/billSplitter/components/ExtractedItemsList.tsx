import { CloseIcon } from "~/assets";
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
                onClick={() => onAddItem(item)}
                className="bg-volt-400 hover:bg-volt-300 rounded-md px-3 py-1 text-sm font-semibold text-zinc-950 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => onRemoveItem(index)}
                className="text-zinc-300 transition-colors hover:text-white"
              >
                <CloseIcon size={16} color="currentColor" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
