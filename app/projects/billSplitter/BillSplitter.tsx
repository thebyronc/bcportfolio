import { useState, useEffect } from "react";
import "./BillSplitter.css";

interface Person {
  id: string;
  name: string;
  color: string;
}

interface LineItem {
  id: string;
  description: string;
  amount: number;
  assignedTo: string[];
}

const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

const STORAGE_KEY = "billSplitterData";

// Load data from localStorage
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        people: data.people || [
          { id: "1", name: "Misa", color: COLORS[0] },
          { id: "2", name: "Bento", color: COLORS[1] },
        ],
        lineItems: data.lineItems || [
          { id: "1", description: "Pizza", amount: 25.5, assignedTo: ["1"] },
          {
            id: "2",
            description: "Drinks",
            amount: 12.0,
            assignedTo: ["1", "2"],
          },
        ],
        tipPercentage: data.tipPercentage || 15,
      };
    }
  } catch (error) {
    console.warn("Failed to load data from localStorage:", error);
  }

  // Return default data if nothing is stored or there's an error
  return {
    people: [
      { id: "1", name: "Misa", color: COLORS[0] },
      { id: "2", name: "Bento", color: COLORS[1] },
    ],
    lineItems: [
      { id: "1", description: "Pizza", amount: 25.5, assignedTo: ["1"] },
      { id: "2", description: "Drinks", amount: 12.0, assignedTo: ["1", "2"] },
    ],
    tipPercentage: 15,
  };
};

export function BillSplitter() {
  const [people, setPeople] = useState<Person[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(15);

  // Load data from localStorage on component mount
  useEffect(() => {
    const {
      people: loadedPeople,
      lineItems: loadedLineItems,
      tipPercentage: loadedTipPercentage,
    } = loadFromStorage();
    setPeople(loadedPeople);
    setLineItems(loadedLineItems);
    setTipPercentage(loadedTipPercentage);
    setIsDataLoaded(true);
  }, []);

  // Save data to localStorage whenever people, lineItems, or tipPercentage change
  useEffect(() => {
    if (people.length > 0 || lineItems.length > 0) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ people, lineItems, tipPercentage }),
        );
      } catch (error) {
        console.warn("Failed to save data to localStorage:", error);
      }
    }
  }, [people, lineItems, tipPercentage]);

  const addPerson = () => {
    if (newPersonName.trim()) {
      const newPerson: Person = {
        id: Date.now().toString(),
        name: newPersonName.trim(),
        color: COLORS[people.length % COLORS.length],
      };
      setPeople([...people, newPerson]);
      setNewPersonName("");
    }
  };

  const removePerson = (personId: string) => {
    setPeople(people.filter((p) => p.id !== personId));
    setLineItems(
      lineItems.map((item) => ({
        ...item,
        assignedTo: item.assignedTo.filter((id) => id !== personId),
      })),
    );
  };

  const addLineItem = () => {
    if (newItemDescription.trim() && newItemAmount) {
      const amount = parseFloat(newItemAmount);
      if (!isNaN(amount) && amount > 0) {
        const newItem: LineItem = {
          id: Date.now().toString(),
          description: newItemDescription.trim(),
          amount,
          assignedTo: [],
        };
        setLineItems([...lineItems, newItem]);
        setNewItemDescription("");
        setNewItemAmount("");
      }
    }
  };

  const removeLineItem = (itemId: string) => {
    setLineItems(lineItems.filter((item) => item.id !== itemId));
  };

  const toggleAssignment = (itemId: string, personId: string) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === itemId) {
          const isAssigned = item.assignedTo.includes(personId);
          return {
            ...item,
            assignedTo: isAssigned
              ? item.assignedTo.filter((id) => id !== personId)
              : [...item.assignedTo, personId],
          };
        }
        return item;
      }),
    );
  };

  const calculatePersonTotal = (personId: string) => {
    return lineItems
      .filter((item) => item.assignedTo.includes(personId))
      .reduce((total, item) => {
        const share = item.amount / item.assignedTo.length;
        return total + share;
      }, 0);
  };

  const calculatePersonTip = (personId: string) => {
    const personTotal = calculatePersonTotal(personId);
    const totalBill = calculateTotal();
    if (totalBill === 0) return 0;

    // Calculate tip proportionally based on person's share of the bill
    const personShare = personTotal / totalBill;
    const totalTip = (totalBill * tipPercentage) / 100;
    return personShare * totalTip;
  };

  const calculatePersonTotalWithTip = (personId: string) => {
    return calculatePersonTotal(personId) + calculatePersonTip(personId);
  };

  const calculateTotal = () => {
    return lineItems.reduce((total, item) => total + item.amount, 0);
  };

  const calculateTotalTip = () => {
    return (calculateTotal() * tipPercentage) / 100;
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTotalTip();
  };

  const getPersonById = (id: string) => people.find((p) => p.id === id);

  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This cannot be undone.",
      )
    ) {
      setPeople([
        { id: "1", name: "Alice", color: COLORS[0] },
        { id: "2", name: "Bob", color: COLORS[1] },
      ]);
      setLineItems([
        { id: "1", description: "Pizza", amount: 25.5, assignedTo: ["1"] },
        {
          id: "2",
          description: "Drinks",
          amount: 12.0,
          assignedTo: ["1", "2"],
        },
      ]);
      setTipPercentage(15);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="bill-splitter">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-volt-400 text-3xl font-bold">Bill Splitter</h1>
            {isDataLoaded && (
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

            <div className="mb-4 flex gap-2">
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
                className="bg-volt-400 hover:bg-volt-300 rounded-md px-4 py-2 font-semibold text-zinc-950 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {people.map((person) => (
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
              Line Items
            </h2>

            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Description"
                className="focus:ring-volt-400 flex-1 rounded-md border border-zinc-600 bg-zinc-700 px-3 py-2 text-white placeholder-zinc-400 focus:ring-2 focus:outline-none"
              />
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
                className="bg-volt-400 hover:bg-volt-300 rounded-md px-4 py-2 font-semibold text-zinc-950 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item) => (
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
                    {people.map((person) => (
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

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Tip Percentage:</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={tipPercentage}
                onChange={(e) => setTipPercentage(parseInt(e.target.value))}
                className="h-2 w-32 cursor-pointer appearance-none rounded-lg bg-zinc-600"
              />
              <span className="text-volt-400 w-12 text-center font-semibold">
                {tipPercentage}%
              </span>
            </div>
            <div className="text-sm text-zinc-400">
              Total Tip: ${calculateTotalTip().toFixed(2)}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="text-volt-400 flex justify-between">
              <span>Tip ({tipPercentage}%):</span>
              <span>${calculateTotalTip().toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-600 pt-2 font-semibold">
              <span>Grand Total:</span>
              <span className="text-volt-400">
                ${calculateGrandTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Totals Section */}
        <div className="mt-8 rounded-lg bg-zinc-800 p-6">
          <h2 className="text-volt-400 mb-4 text-xl font-semibold">Totals</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <div key={person.id} className="rounded-md bg-zinc-700 p-4">
                <div className="mb-2 flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full ${person.color}`}></div>
                  <span className="font-medium">{person.name}</span>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculatePersonTotal(person.id).toFixed(2)}</span>
                  </div>
                  <div className="text-volt-400 flex justify-between">
                    <span>Tip:</span>
                    <span>${calculatePersonTip(person.id).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-3 border-t border-zinc-600 pt-2">
                  <p className="text-volt-400 text-xl font-bold">
                    ${calculatePersonTotalWithTip(person.id).toFixed(2)}
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
                ${calculateGrandTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
