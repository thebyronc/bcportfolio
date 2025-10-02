import { useState, useRef } from 'react';
import { PhotoIcon } from '~/assets';

export function ImageToBase64() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setError('');
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Convert to base64
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setBase64String(result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError('Error reading file');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setError('');
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Convert to base64
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setBase64String(result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError('Error reading file');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(base64String);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const clearAll = () => {
    setSelectedFile(null);
    setBase64String('');
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadBase64 = () => {
    const element = document.createElement('a');
    const file = new Blob([base64String], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'base64-encoded-image.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto pt-32 p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Image to Base64 Converter</h1>
        <p className="text-gray-400">Convert your images to base64 format for easy embedding</p>
      </div>

      {/* File Upload Area */}
      <div
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="space-y-4">
          <div className="flex justify-center">
            <PhotoIcon className="w-16 h-16 text-gray-400" />
          </div>
          <div>
            <p className="text-lg text-white mb-2">Drop an image here or click to browse</p>
            <p className="text-sm text-gray-400">Supports JPG, PNG, GIF, WebP and other image formats</p>
            <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 mt-2">Converting image...</p>
        </div>
      )}

      {/* Preview and Results */}
      {selectedFile && previewUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Preview</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '300px' }}
              />
              <div className="mt-3 text-sm text-gray-400">
                <p><strong>File:</strong> {selectedFile.name}</p>
                <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                <p><strong>Type:</strong> {selectedFile.type}</p>
              </div>
            </div>
          </div>

          {/* Base64 Output */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Base64 Output</h3>
              <div className="space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={downloadBase64}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <textarea
                value={base64String}
                readOnly
                className="w-full h-64 bg-gray-900 text-gray-300 p-3 rounded border border-gray-600 text-xs font-mono resize-none"
                placeholder="Base64 string will appear here..."
              />
              <div className="mt-2 text-xs text-gray-500">
                Length: {base64String.length} characters
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Button */}
      {selectedFile && (
        <div className="text-center">
          <button
            onClick={clearAll}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">How to use Base64 images</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p><strong>In HTML:</strong> <code className="bg-gray-700 px-2 py-1 rounded">&lt;img src="data:image/jpeg;base64,YOUR_BASE64_STRING" /&gt;</code></p>
          <p><strong>In CSS:</strong> <code className="bg-gray-700 px-2 py-1 rounded">background-image: url('data:image/jpeg;base64,YOUR_BASE64_STRING');</code></p>
          <p><strong>In JavaScript:</strong> <code className="bg-gray-700 px-2 py-1 rounded">const img = new Image(); img.src = 'data:image/jpeg;base64,YOUR_BASE64_STRING';</code></p>
        </div>
      </div>
    </div>
  );
}
