import type { Route } from "./+types/home";
import Welcome from "../pages/Welcome";
import HomePage from "../pages/Home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Byron Chang" },
    { name: "description", content: "Byron Chang - Software Engineer" },
  ];
}

export default function Home() {
  return <HomePage />;
}
