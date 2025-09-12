import { useState } from "react";
import { useBillSplitter } from "../BillSplitterContext";
import { 
  setTipPercentage as setTipPercentageAction,
  setTipAmount as setTipAmountAction,
  setTipMode as setTipModeAction
} from "../billSplitterActions";

export function TipSection() {
  const { state, dispatch, calculations } = useBillSplitter();
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  return (
    <div className="mt-8 rounded-lg bg-zinc-800 p-4 sm:p-6 shadow-lg">
      <h2 className="text-volt-400 mb-4 text-xl font-semibold">Tip Calculator</h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">
              {state.isTipAmountMode ? "Tip Amount:" : "Tip Percentage:"}
            </label>
            <div className="flex gap-2" role="group" aria-label="Tip calculation mode">
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  dispatch(setTipModeAction(false));
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-volt-400 ${
                  !state.isTipAmountMode
                    ? "bg-volt-400 text-black"
                    : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                }`}
                aria-pressed={!state.isTipAmountMode}
              >
                %
              </button>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  dispatch(setTipModeAction(true));
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-volt-400 ${
                  state.isTipAmountMode
                    ? "bg-volt-400 text-black"
                    : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                }`}
                aria-pressed={state.isTipAmountMode}
              >
                $
              </button>
            </div>
          </div>
          <div className="text-sm text-zinc-400 bg-zinc-700 px-3 py-2 rounded-lg">
            <span className="font-medium">Total Tip: </span>
            <span className="text-volt-400 font-semibold">${calculations.calculateTotalTip().toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {!state.isTipAmountMode ? (
            <>
              <div className="flex w-fit rounded-lg overflow-hidden border border-zinc-600">
                {[0, 15, 18, 20].map((percent, idx) => (
                  <button
                    key={percent}
                    onClick={() => {
                      setShowCustomInput(false);
                      dispatch(setTipPercentageAction(percent));
                    }}
                    className={`px-4 py-2 font-semibold uppercase focus:outline-none transition-colors border-r border-zinc-600 border-t border-b last:border-r-0
                      ${state.tipPercentage === percent && !showCustomInput
                        ? "text-volt-400 bg-zinc-800"
                        : "text-zinc-300 bg-zinc-900 hover:bg-zinc-800"}
                      ${idx === 0 ? "rounded-l-lg" : ""}
                    `}
                    style={{ 
                      border: "none", 
                      borderRadius: 0,
                      boxShadow: state.tipPercentage === percent && !showCustomInput ? "inset 0 0 0 2px #fbbf24" : "none"
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = "inset 0 0 0 2px #fbbf24";
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = state.tipPercentage === percent && !showCustomInput ? "inset 0 0 0 2px #fbbf24" : "none";
                    }}
                  >
                    {percent}%
                  </button>
                ))}
                <button
                  onClick={() => {
                    setShowCustomInput(true);
                    dispatch(setTipPercentageAction(-1));
                  }}
                  className={`px-4 py-2 font-semibold uppercase focus:outline-none transition-colors rounded-r-lg
                    ${showCustomInput
                      ? "text-volt-400 bg-zinc-800"
                      : "text-zinc-300 bg-zinc-900 hover:bg-zinc-800"}
                  `}
                  style={{ 
                    border: "none", 
                    borderRadius: 0,
                    boxShadow: showCustomInput ? "inset 0 0 0 2px #fbbf24" : "none"
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = "inset 0 0 0 2px #fbbf24";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = showCustomInput ? "inset 0 0 0 2px #fbbf24" : "none";
                  }}
                >
                  Custom
                </button>
              </div>
              {showCustomInput && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    autoFocus
                    onFocus={e => e.target.select()}
                    value={state.tipPercentage > 0 ? state.tipPercentage : ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0 && val <= 100) {
                        dispatch(setTipPercentageAction(val));
                      } else if (e.target.value === '') {
                        dispatch(setTipPercentageAction(0));
                      }
                    }}
                    className="w-24 border border-zinc-600 bg-zinc-700 px-3 py-2 text-white text-center rounded-lg focus:ring-volt-400 focus:ring-2 focus:outline-none focus:border-volt-400"
                    placeholder="0.0"
                  />
                  <span className="text-sm text-zinc-400">%</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">$</span>
              <input
                type="number"
                min="0"
                step="1"
                autoFocus
                onFocus={e => e.target.select()}
                value={state.tipAmount > 0 ? state.tipAmount : ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    dispatch(setTipAmountAction(val));
                  } else if (e.target.value === '') {
                    dispatch(setTipAmountAction(0));
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
            Tip {state.isTipAmountMode 
              ? `($${state.tipAmount.toFixed(2)})` 
              : `(${state.tipPercentage}%)`
            }:
          </span>
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
