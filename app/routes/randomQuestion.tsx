import type { Route } from "./+types/home";
import { RandomQuestion } from "../projects/RandomQuestion/RandomQuestion";
import { LoadingSpinner } from "../components/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RandomQuestion" },
    { name: "description", content: "Random Question" },
  ];
}

export function hydrateFallback() {
  return <LoadingSpinner message="Loading Random Question..." />;
}

export default function RandomQuestionPage() {
  return <RandomQuestion />;
}
