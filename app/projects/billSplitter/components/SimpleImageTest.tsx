import { useState, useEffect } from "react";
import { useFetcher } from "react-router";

export function SimpleImageTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const fetcher = useFetcher();

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.data) {
      console.log("Fetcher response:", fetcher.data);
      setTestResult(fetcher.data);
    }
  }, [fetcher.data]);

  // Handle fetcher errors
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data === undefined) {
      setTestResult({
        success: false,
        error: "Failed to process image - no response received",
      });
    }
  }, [fetcher.state, fetcher.data]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      testImageUpload(file);
    }
  };

  const testImageUpload = (file: File) => {
    setTestResult(null);

    console.log("Testing image upload:", {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    });

    const formData = new FormData();
    formData.append("image", file);
    console.log("file", file);

    // Use fetcher.submit instead of fetch
    fetcher.submit(formData, {
      method: "POST",
      action: "/api/ocr/test",
    });
  };

  return (
    <div className="rounded-lg bg-zinc-800 p-4 sm:p-6">
      <h2 className="text-volt-400 mb-4 text-xl font-semibold">
        Simple Image Upload Test
      </h2>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="file:bg-volt-400 hover:file:bg-volt-300 mb-4 block w-full text-sm text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-950"
        />

        {fetcher.state === "submitting" && (
          <div className="text-volt-400">Testing image upload...</div>
        )}
      </div>

      {testResult && (
        <div className="space-y-4">
          <div
            className={`rounded-md p-4 ${testResult.success ? "border border-green-500 bg-green-900/20" : "border border-red-500 bg-red-900/20"}`}
          >
            <h3
              className={`font-semibold ${testResult.success ? "text-green-400" : "text-red-400"}`}
            >
              {testResult.success ? "✅ Test Passed" : "❌ Test Failed"}
            </h3>
            <p className="mt-1 text-sm text-zinc-300">
              {testResult.message || testResult.error}
            </p>
          </div>

          {testResult.fileInfo && (
            <div className="rounded-md bg-zinc-700 p-3">
              <h4 className="mb-2 text-sm font-semibold text-zinc-300">
                File Information:
              </h4>
              <div className="space-y-1 text-xs text-zinc-400">
                <div>Name: {testResult.fileInfo.name}</div>
                <div>Type: {testResult.fileInfo.type}</div>
                <div>Size: {testResult.fileInfo.size} bytes</div>
                <div>
                  Last Modified:{" "}
                  {new Date(testResult.fileInfo.lastModified).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {testResult.conversion && (
            <div className="rounded-md bg-zinc-700 p-3">
              <h4 className="mb-2 text-sm font-semibold text-zinc-300">
                Conversion Details:
              </h4>
              <div className="space-y-1 text-xs text-zinc-400">
                <div>Method: {testResult.conversion.method}</div>
                <div>
                  Success: {testResult.conversion.success ? "Yes" : "No"}
                </div>
                <div>Base64 Length: {testResult.conversion.base64Length}</div>
                {testResult.conversion.error && (
                  <div className="text-red-400">
                    Error: {testResult.conversion.error}
                  </div>
                )}
              </div>
            </div>
          )}

          {testResult.base64Preview && (
            <div className="rounded-md bg-zinc-700 p-3">
              <h4 className="mb-2 text-sm font-semibold text-zinc-300">
                Base64 Preview:
              </h4>
              <div className="font-mono text-xs break-all text-zinc-400">
                {testResult.base64Preview}
              </div>
            </div>
          )}

          <details className="rounded-md bg-zinc-700 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-zinc-300">
              Raw Response
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-zinc-400">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div className="mt-4 text-xs text-zinc-500">
        <p>
          This test endpoint helps debug image processing issues without calling
          Gemini API.
        </p>
        <p>
          Check the browser console and server logs for detailed information.
        </p>
      </div>
    </div>
  );
}
