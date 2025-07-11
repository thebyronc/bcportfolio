import type { Route } from "./+types/textCompare";
import { TextCompare } from "../projects/textCompare/TextCompare";
import LoadingSpinner from "../components/LoadingSpinner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Text Compare - Byron Chang" },
    { name: "description", content: "Text Comparison Tool" },
  ];
}

export function hydrateFallback() {
  return <LoadingSpinner />;
}

export default function TextComparePage() {
  return <TextCompare />;
}
