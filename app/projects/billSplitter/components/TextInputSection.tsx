interface TextInputSectionProps {
  manualText: string;
  isScanning: boolean;
  onTextChange: (text: string) => void;
  onProcessText: () => void;
}

export function TextInputSection({ manualText, isScanning, onTextChange, onProcessText }: TextInputSectionProps) {
  return (
    <div className="space-y-3">
      <label htmlFor="receipt-text-input" className="sr-only">
        Receipt text input
      </label>
      <textarea
        id="receipt-text-input"
        value={manualText}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Paste receipt text here...&#10;Example:&#10;Coffee $3.50&#10;Sandwich $8.99&#10;Tax $1.00"
        className="w-full rounded-md bg-zinc-700 px-3 py-2 text-white placeholder-zinc-400 focus:border-volt-400 focus:outline-none focus:ring-1 focus:ring-volt-400"
        rows={6}
      />
      <button
        id="process-text-button"
        onClick={onProcessText}
        disabled={!manualText.trim() || isScanning}
        className="bg-volt-400 hover:bg-volt-300 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold text-zinc-950 transition-colors disabled:cursor-not-allowed disabled:bg-zinc-600"
      >
        {isScanning ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-zinc-950"></div>
            Processing...
          </>
        ) : (
          "Extract Items from Text"
        )}
      </button>
    </div>
  );
}
