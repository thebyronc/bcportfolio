import React from "react";

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
  // Filter items assigned to this person and calculate their share
  const personItems = lineItems
    .filter(item => item.assignedTo.includes(personId))
    .map(item => ({
      ...item,
      personShare: item.amount / item.assignedTo.length
    }));

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
            className="flex justify-between items-center py-1 px-2 bg-zinc-600 rounded text-sm"
          >
            <div className="flex-1 mr-2">
              <span className="text-zinc-200 truncate block">
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
