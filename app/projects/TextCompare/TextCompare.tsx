import { useState } from "react";
import * as diff from "diff";

export function TextCompare() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [differences, setDifferences] = useState<diff.Change[]>([]);

  const compareTexts = () => {
    const diffResult = diff.diffWords(text1, text2);
    setDifferences(diffResult);
  };

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="container mx-auto max-w-4xl p-4">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
          Text Comparison Tool
        </h1>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Original Text
            </label>
            <textarea
              className="h-64 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              value={text1}
              onChange={e => setText1(e.target.value)}
              placeholder="Enter the original text here..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Modified Text
            </label>
            <textarea
              className="h-64 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              value={text2}
              onChange={e => setText2(e.target.value)}
              placeholder="Enter the modified text here..."
            />
          </div>
        </div>

        <button
          onClick={compareTexts}
          className="mb-6 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Compare Texts
        </button>

        <div className="mt-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
            Differences
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            {differences.map((part, index) => (
              <span
                key={index}
                className={
                  part.added
                    ? "bg-green-200 dark:bg-green-800"
                    : part.removed
                      ? "bg-red-200 dark:bg-red-800"
                      : ""
                }
              >
                {part.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
