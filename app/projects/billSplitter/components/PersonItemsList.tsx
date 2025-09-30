import React from "react";
import { calculatePersonShares } from "../billSplitterUtils";

interface LineItem {
  id: string;
  description: string;
  amount: number;
  assignedTo: string[];
}

interface PersonItemsListProps {
  personId: string;
  personName: string;
  lineItems: LineItem[];
  className?: string;
}

const PersonItemsList: React.FC<PersonItemsListProps> = ({
  personId,
  personName,
  lineItems,
  className = "",
}) => {
  // Filter items assigned to this person and calculate their share using smart rounding
  const personItems = lineItems
    .filter(item => item.assignedTo.includes(personId))
    .map(item => {
      const shares = calculatePersonShares(item);
      return {
        ...item,
        personShare: shares[personId] || 0,
      };
    });

  if (personItems.length === 0) {
    return (
      <div className={`text-sm text-zinc-400 italic ${className}`}>
        No items assigned to {personName}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="mb-2 text-sm font-medium text-zinc-300">
        Items for {personName}:
      </h4>
      <div className="space-y-1">
        {personItems.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded bg-zinc-600 px-2 py-1 text-sm"
          >
            <div className="mr-2 flex-1">
              <span className="block truncate text-zinc-200">
                {item.description}
              </span>
            </div>
            <span className="text-volt-400 font-medium whitespace-nowrap">
              ${item.personShare.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonItemsList;
