import type { Route } from "./+types/home";
import { LoadingSpinner } from "../components/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chrome DevTools Configuration" },
    { name: "description", content: "Chrome DevTools Configuration" },
  ];
}

export function hydrateFallback() {
  return <LoadingSpinner message="Loading DevTools..." />;
}

export default function DevToolsConfig() {
  return (
    <div>
      <h1>Chrome DevTools Configuration</h1>
      <p>This endpoint provides Chrome DevTools configuration.</p>
    </div>
  );
}
