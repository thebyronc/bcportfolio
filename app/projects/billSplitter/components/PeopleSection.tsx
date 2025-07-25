import { useState } from "react";
import { useBillSplitter } from "../BillSplitterContext";
import {
  addPerson as addPersonAction,
  removePerson as removePersonAction,
} from "../billSplitterActions";

export function PeopleSection() {
  const { state, dispatch, calculations } = useBillSplitter();
  const [newPersonName, setNewPersonName] = useState("");

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

  return (
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
              <div className={`h-4 w-4 rounded-full ${person.color}`}></div>
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
  );
}
