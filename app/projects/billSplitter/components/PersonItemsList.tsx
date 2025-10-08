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
        personShare: shares[personId] || 0
      };
    });

  if (personItems.length === 0) {
    return (
      <div className={`text-zinc-400 text-sm italic ${className}`}>
        No items assigned to {personName}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-zinc-300 mb-2">
        Items for {personName}:
      </h4>
      <div className="space-y-1">
        {personItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center rounded text-sm border-b-1 border-zinc-600 gap-2"
          >
            <div className="flex-1 min-w-0">
              <span className="text-zinc-200 truncate block">
                {item.description}
              </span>
            </div>
            <span className="text-volt-400 font-medium whitespace-nowrap flex-shrink-0">
              ${item.personShare.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonItemsList;
