import { useState } from "react";
import "./BillSplitter.css";
import { useBillSplitter, BillSplitterProvider } from "./BillSplitterContext";
import {
  addPerson as addPersonAction,
  removePerson as removePersonAction,
  addLineItem as addLineItemAction,
  removeLineItem as removeLineItemAction,
  toggleAssignment as toggleAssignmentAction,
  setTipPercentage as setTipPercentageAction,
  clearAllData as clearAllDataAction,
} from "./billSplitterActions";
import { clearStorage } from "./billSplitterUtils";

function BillSplitterContent() {
  const { state, dispatch, calculations } = useBillSplitter();
  const [newPersonName, setNewPersonName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");

  const addPerson = () => {
    if (newPersonName.trim()) {
      const newPerson = {
        id: Date.now().toString(),
        name: newPersonName.trim(),
        color: calculations.getNextColor(),
      };
      dispatch(addPersonAction(newPerson));
      setNewPersonName("");
    }
  };

  const removePerson = (personId: string) => {
    dispatch(removePersonAction(personId));
  };

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

  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This cannot be undone.",
      )
    ) {
      dispatch(clearAllDataAction());
      clearStorage();
    }
  };

  return (
    <div className="bill-splitter">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-volt-400 text-3xl font-bold">Bill Splitter</h1>
            {state.isDataLoaded && (
              <p className="mt-2 text-center text-zinc-400">
                Data automatically saved to your browser
              </p>
            )}
          </div>
          <button
            onClick={clearAllData}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            title="Clear all data and reset to defaults"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* People Section */}
          <div className="rounded-lg bg-zinc-800 p-6">
            <h2 className="text-volt-400 mb-4 text-xl font-semibold">People</h2>

            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                placeholder="Enter name"
                className="focus:ring-volt-400 flex-1 rounded-md border border-zinc-600 bg-zinc-700 px-3 py-2 text-white placeholder-zinc-400 focus:ring-2 focus:outline-none"
                onKeyPress={(e) => e.key === "Enter" && addPerson()}
              />
              <button
                onClick={addPerson}
                className="bg-volt-400 hover:bg-volt-300 w-full rounded-md px-4 py-2 font-semibold text-zinc-950 transition-colors sm:w-auto"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {state.people.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between rounded-md bg-zinc-700 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-4 w-4 rounded-full ${person.color}`}
                    ></div>
                    <span className="font-medium">{person.name}</span>
                  </div>
                  <button
                    onClick={() => removePerson(person.id)}
                    className="text-red-400 transition-colors hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Line Items Section */}
          <div className="rounded-lg bg-zinc-800 p-6">
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
        </div>

        {/* Tip Section */}
        <div className="mt-8 rounded-lg bg-zinc-800 p-6">
          <h2 className="text-volt-400 mb-4 text-xl font-semibold">Tip</h2>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="text-sm font-medium">Tip Percentage:</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={state.tipPercentage}
                onChange={(e) =>
                  dispatch(setTipPercentageAction(parseInt(e.target.value)))
                }
                className="h-2 w-32 cursor-pointer appearance-none rounded-lg bg-zinc-600"
              />
              <span className="text-volt-400 w-12 text-center font-semibold">
                {state.tipPercentage}%
              </span>
            </div>
            <div className="text-sm text-zinc-400">
              Total Tip: ${calculations.calculateTotalTip().toFixed(2)}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${calculations.calculateTotal().toFixed(2)}</span>
            </div>
            <div className="text-volt-400 flex justify-between">
              <span>Tip ({state.tipPercentage}%):</span>
              <span>${calculations.calculateTotalTip().toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-600 pt-2 font-semibold">
              <span>Grand Total:</span>
              <span className="text-volt-400">
                ${calculations.calculateGrandTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Totals Section */}
        <div className="mt-8 rounded-lg bg-zinc-800 p-6">
          <h2 className="text-volt-400 mb-4 text-xl font-semibold">Totals</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {state.people.map((person) => (
              <div key={person.id} className="rounded-md bg-zinc-700 p-4">
                <div className="mb-2 flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full ${person.color}`}></div>
                  <span className="font-medium">{person.name}</span>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>
                      {calculations.countItemsAssignedToPerson(person.id)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                      ${calculations.calculatePersonTotal(person.id).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-volt-400 flex justify-between">
                    <span>Tip:</span>
                    <span>
                      ${calculations.calculatePersonTip(person.id).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 border-t border-zinc-600 pt-2">
                  <p className="text-volt-400 text-xl font-bold">
                    $
                    {calculations
                      .calculatePersonTotalWithTip(person.id)
                      .toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-zinc-600 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                Grand Total (with tip):
              </span>
              <span className="text-volt-400 text-2xl font-bold">
                ${calculations.calculateGrandTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BillSplitter() {
  return (
    <BillSplitterProvider>
      <BillSplitterContent />
    </BillSplitterProvider>
  );
}
