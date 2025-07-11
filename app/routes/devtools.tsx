import type { Route } from "./+types/devtools";
import LoadingSpinner from "../components/LoadingSpinner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DevTools - Byron Chang" },
    { name: "description", content: "Developer Tools" },
  ];
}

export function hydrateFallback() {
  return <LoadingSpinner />;
}

export default function DevToolsPage() {
  return (
    <div className="container mx-auto p-4 pt-16">
      <h1 className="mb-4 text-2xl font-bold">Developer Tools</h1>
      <p>This page is for developer tools and debugging purposes.</p>
    </div>
  );
}
