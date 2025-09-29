import { useState } from "react";
import { useBillSplitter } from "../BillSplitterContext";
import { 
  setTaxPercentage as setTaxPercentageAction,
  setTaxAmount as setTaxAmountAction,
  setTaxMode as setTaxModeAction
} from "../billSplitterActions";

export function TaxSection() {
  const { state, dispatch, calculations } = useBillSplitter();
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  return (
    <div className="rounded-lg bg-zinc-800 p-4 sm:p-6">
      <h2 className="text-volt-400 mb-4 text-xl font-semibold">Tax Calculator</h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">
              {state.isTaxAmountMode ? "Tax Amount:" : "Tax Percentage:"}
            </label>
            <div className="flex gap-2" role="group" aria-label="Tax calculation mode">
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  dispatch(setTaxModeAction(false));
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-volt-400 ${
                  !state.isTaxAmountMode
                    ? "bg-volt-400 text-black"
                    : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                }`}
                aria-pressed={!state.isTaxAmountMode}
              >
                %
              </button>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  dispatch(setTaxModeAction(true));
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-volt-400 ${
                  state.isTaxAmountMode
                    ? "bg-volt-400 text-black"
                    : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                }`}
                aria-pressed={state.isTaxAmountMode}
              >
                $
              </button>
            </div>
          </div>

        </div>
        <div className="flex flex-col gap-3">
          {!state.isTaxAmountMode ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                autoFocus
                onFocus={e => (e.target as HTMLInputElement).select()}
                value={state.taxPercentage > 0 ? state.taxPercentage : ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0 && val <= 100) {
                    dispatch(setTaxPercentageAction(val));
                  } else if (e.target.value === '') {
                    dispatch(setTaxPercentageAction(0));
                  }
                }}
                className="w-32 border border-zinc-600 bg-zinc-700 px-3 py-2 text-white text-center rounded-lg focus:ring-volt-400 focus:ring-2 focus:outline-none focus:border-volt-400"
                placeholder="0.0"
              />
              <span className="text-sm text-zinc-400">%</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">$</span>
              <input
                type="number"
                min="0"
                step="1"
                autoFocus
                onFocus={e => e.target.select()}
                value={state.taxAmount > 0 ? state.taxAmount : ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    dispatch(setTaxAmountAction(val));
                  } else if (e.target.value === '') {
                    dispatch(setTaxAmountAction(0));
                  }
                }}
                className="w-32 border border-zinc-600 bg-zinc-700 px-3 py-2 text-white text-center rounded-lg focus:ring-volt-400 focus:ring-2 focus:outline-none focus:border-volt-400"
                placeholder="0"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${calculations.calculateTotal().toFixed(2)}</span>
        </div>
        <div className="text-volt-400 flex justify-between">
          <span>
            Tax {state.isTaxAmountMode 
              ? `($${state.taxAmount.toFixed(2)})` 
              : `(${state.taxPercentage}%)`
            }:
          </span>
          <span>${calculations.calculateTotalTax().toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-zinc-600 pt-2 font-semibold">
          <span>Subtotal + Tax:</span>
          <span className="text-volt-400">
            ${(calculations.calculateTotal() + calculations.calculateTotalTax()).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
