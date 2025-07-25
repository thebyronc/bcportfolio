import "./BillSplitter.css";
import { useBillSplitter, BillSplitterProvider } from "./BillSplitterContext";
import { clearAllData as clearAllDataAction } from "./billSplitterActions";
import { clearStorage } from "./billSplitterUtils";
import {
  PeopleSection,
  LineItemsSection,
  TipSection,
  TotalsSection,
  ReceiptScanner,
} from "./components";

function BillSplitterContent() {
  const { state, dispatch } = useBillSplitter();

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
          <PeopleSection />
          <LineItemsSection />
          <ReceiptScanner />
        </div>

        <TipSection />
        <TotalsSection />
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
