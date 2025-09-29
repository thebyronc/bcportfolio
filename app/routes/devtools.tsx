import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chrome DevTools Configuration" },
    { name: "description", content: "Chrome DevTools Configuration" },
  ];
}

export default function DevToolsConfig() {
  return (
    <div>
      <h1>Chrome DevTools Configuration</h1>
      <p>This endpoint provides Chrome DevTools configuration.</p>
    </div>
  );
}
