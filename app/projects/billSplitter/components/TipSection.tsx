import { useBillSplitter } from "../BillSplitterContext";
import { setTipPercentage as setTipPercentageAction } from "../billSplitterActions";

export function TipSection() {
  const { state, dispatch, calculations } = useBillSplitter();

  return (
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
  );
}
