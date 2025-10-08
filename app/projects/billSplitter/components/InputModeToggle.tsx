import type { InputMode } from './types/receiptScanner';

interface InputModeToggleProps {
  inputMode: InputMode;
  onModeChange: (mode: InputMode) => void;
}

export function InputModeToggle({ inputMode, onModeChange }: InputModeToggleProps) {
  return (
    <div className="mb-4">
      <div className="flex rounded-lg bg-zinc-700 p-1">
        <button
          id="input-mode-image"
          onClick={() => onModeChange('image')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            inputMode === 'image'
              ? 'bg-volt-400 text-zinc-950'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          Image Upload
        </button>
        <button
          id="input-mode-text"
          onClick={() => onModeChange('text')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            inputMode === 'text'
              ? 'bg-volt-400 text-zinc-950'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          Manual Text
        </button>
      </div>
    </div>
  );
}
