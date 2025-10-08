interface JsonResponseDisplayProps {
  jsonResponse: any;
  showJsonResponse: boolean;
  onToggleJsonResponse: () => void;
}

export function JsonResponseDisplay({ 
  jsonResponse, 
  showJsonResponse, 
  onToggleJsonResponse 
}: JsonResponseDisplayProps) {
  if (!jsonResponse) return null;

  return (
    <div className="mb-4">
      <button
        onClick={onToggleJsonResponse}
        className="text-volt-400 hover:text-volt-300 text-sm underline"
      >
        {showJsonResponse ? "Hide" : "Show"} JSON Response
      </button>
      {showJsonResponse && (
        <div className="mt-2 max-h-64 overflow-y-auto rounded-md bg-zinc-700 p-3 text-xs text-zinc-300">
          <pre className="whitespace-pre-wrap">{JSON.stringify(jsonResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
