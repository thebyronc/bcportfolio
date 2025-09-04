import { useBillSplitter } from "../BillSplitterContext";

export function TotalsSection() {
  const { state, calculations } = useBillSplitter();

  return (
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
                {calculations.calculatePersonTotalWithTip(person.id).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-zinc-600 pt-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Grand Total (with tip):</span>
          <span className="text-volt-400 text-2xl font-bold">
            ${calculations.calculateGrandTotal().toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
