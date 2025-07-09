import type { Route } from "./+types/home";
import Welcome from "../pages/Welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Byron Chang" },
    { name: "description", content: "Byron Chang - Software Engineer" },
  ];
}

export default function Home() {
  return <Welcome />;
}
