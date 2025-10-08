import { useReceiptProcessing } from './hooks/useReceiptProcessing';
import { InputModeToggle } from './InputModeToggle';
import { ImageUploadSection } from './ImageUploadSection';
import { TextInputSection } from './TextInputSection';
import { ExtractedItemsList } from './ExtractedItemsList';
import { JsonResponseDisplay } from './JsonResponseDisplay';

export function ReceiptScanner() {
  const {
    state,
    actions,
    fileInputRef,
    handleFileSelect,
    processManualText,
    addExtractedItem,
    addAllItems,
    removeItem,
  } = useReceiptProcessing();

  return (
    <div className="rounded-lg bg-zinc-800 p-4 sm:p-6">
      <h2 className="text-volt-400 mb-4 text-xl font-semibold">
        Receipt Scanner
      </h2>

      <InputModeToggle 
        inputMode={state.inputMode} 
        onModeChange={actions.setInputMode} 
      />

      <div className="mb-4 space-y-3">
        {state.inputMode === 'image' ? (
          <ImageUploadSection
            isScanning={state.isScanning}
            onFileSelect={handleFileSelect}
            fileInputRef={fileInputRef}
          />
        ) : (
          <TextInputSection
            manualText={state.manualText}
            isScanning={state.isScanning}
            onTextChange={actions.setManualText}
            onProcessText={processManualText}
          />
        )}
      </div>

      {state.scanProgress && (
        <div className="mb-4 text-sm text-zinc-400">{state.scanProgress}</div>
      )}

      <JsonResponseDisplay
        jsonResponse={state.jsonResponse}
        showJsonResponse={state.showJsonResponse}
        onToggleJsonResponse={() => actions.setShowJsonResponse(!state.showJsonResponse)}
      />

      <ExtractedItemsList
        extractedItems={state.extractedItems}
        onAddItem={addExtractedItem}
        onAddAllItems={addAllItems}
        onRemoveItem={removeItem}
      />

      <div className="mt-4 text-xs text-zinc-500">
        <p>Supported formats: JPEG, PNG, GIF, BMP</p>
        <p>
          For best results, ensure the receipt is well-lit and clearly visible
        </p>
      </div>
    </div>
  );
}
