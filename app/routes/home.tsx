import type { Route } from "./+types/home";
import HomePage from "../pages/Home";
import { LoadingSpinner } from "../components/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Byron Chang" },
    { name: "description", content: "Byron Chang - Software Engineer" },
  ];
}

export function hydrateFallback() {
  return <LoadingSpinner message="Loading..." />;
}

export default function Home() {
  return <HomePage />;
}
