import type { Route } from "./+types/home";
import { TextCompare } from "../projects/TextCompare/TextCompare";
import { LoadingSpinner } from "../components/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Text Comparitor" },
    { name: "description", content: "Byron Chang - Software Engineer" },
  ];
}

export function hydrateFallback() {
  return <LoadingSpinner message="Loading Text Compare..." />;
}

export default function Home() {
  return <TextCompare />;
}
