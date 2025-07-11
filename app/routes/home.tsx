import type { Route } from "./+types/home";
import Welcome from "../pages/Welcome";
import LoadingSpinner from "../components/LoadingSpinner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Byron Chang" },
    { name: "description", content: "Byron Chang - Software Engineer" },
  ];
}

export function hydrateFallback() {
  return <LoadingSpinner />;
}

export default function Home() {
  return <Welcome />;
}
