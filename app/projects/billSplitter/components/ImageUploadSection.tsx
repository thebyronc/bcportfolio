import { PhotoIcon } from "~/assets";

interface ImageUploadSectionProps {
  isScanning: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ImageUploadSection({ isScanning, onFileSelect, fileInputRef }: ImageUploadSectionProps) {
  return (
    <>
      <label htmlFor="receipt-image-upload" className="sr-only">
        Upload receipt image
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
        id="receipt-image-upload"
      />
      <button
        id="upload-receipt-button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isScanning}
        className="bg-volt-400 hover:bg-volt-300 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold text-zinc-950 transition-colors disabled:cursor-not-allowed disabled:bg-zinc-600"
      >
        {isScanning ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-zinc-950"></div>
            Scanning...
          </>
        ) : (
          <>
            <PhotoIcon />
            Upload Receipt Image
          </>
        )}
      </button>
    </>
  );
}
