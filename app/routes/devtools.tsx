import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chrome DevTools Configuration" },
    { name: "description", content: "Chrome DevTools Configuration" },
  ];
}

export default function DevToolsConfig() {
  return new Response(
    JSON.stringify({
      version: 1,
      rules: [],
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
