import { useState } from "react";
import { useBillSplitter } from "../BillSplitterContext";
import {
  addLineItem as addLineItemAction,
  removeLineItem as removeLineItemAction,
  toggleAssignment as toggleAssignmentAction,
} from "../billSplitterActions";

export function LineItemsSection() {
  const { state, dispatch } = useBillSplitter();
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");

  const addLineItem = () => {
    if (newItemDescription.trim() && newItemAmount) {
      const amount = parseFloat(newItemAmount);
      if (!isNaN(amount) && amount > 0) {
        const newItem = {
          id: Date.now().toString(),
          description: newItemDescription.trim(),
          amount,
          assignedTo: [],
        };
        dispatch(addLineItemAction(newItem));
        setNewItemDescription("");
        setNewItemAmount("");
      }
    }
  };

  const removeLineItem = (itemId: string) => {
    dispatch(removeLineItemAction(itemId));
  };

  const toggleAssignment = (itemId: string, personId: string) => {
    dispatch(toggleAssignmentAction(itemId, personId));
  };

  return (
    <div className="rounded-lg bg-zinc-800 p-4 sm:p-6">
      <h2 className="text-volt-400 mb-4 text-xl font-semibold">
        Line Items ({state.lineItems.length})
      </h2>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={newItemDescription}
          onChange={(e) => setNewItemDescription(e.target.value)}
          placeholder="Description"
          className="focus:ring-volt-400 flex-1 rounded-md border border-zinc-600 bg-zinc-700 px-3 py-2 text-white placeholder-zinc-400 focus:ring-2 focus:outline-none"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            placeholder="Amount"
            step="0.01"
            min="0"
            className="focus:ring-volt-400 w-24 rounded-md border border-zinc-600 bg-zinc-700 px-3 py-2 text-white placeholder-zinc-400 focus:ring-2 focus:outline-none"
            onKeyPress={(e) => e.key === "Enter" && addLineItem()}
          />
          <button
            onClick={addLineItem}
            className="bg-volt-400 hover:bg-volt-300 w-full rounded-md px-4 py-2 font-semibold text-zinc-950 transition-colors sm:w-auto"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {state.lineItems.map((item) => (
          <div key={item.id} className="rounded-md bg-zinc-700 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{item.description}</h3>
                <p className="text-volt-400 font-semibold">
                  ${item.amount.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeLineItem(item.id)}
                className="text-red-400 transition-colors hover:text-red-300"
              >
                ×
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {state.people.map((person) => (
                <button
                  key={person.id}
                  onClick={() => toggleAssignment(item.id, person.id)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                    item.assignedTo.includes(person.id)
                      ? `${person.color} text-white`
                      : "bg-zinc-600 text-zinc-300 hover:bg-zinc-500"
                  }`}
                >
                  {person.name}
                </button>
              ))}
            </div>

            {item.assignedTo.length > 0 && (
              <p className="mt-2 text-sm text-zinc-400">
                Split {item.assignedTo.length} ways: $
                {(item.amount / item.assignedTo.length).toFixed(2)} each
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
