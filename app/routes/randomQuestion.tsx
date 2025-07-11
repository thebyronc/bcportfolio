import type { Route } from "./+types/randomQuestion";
import { RandomQuestion } from "../projects/randomQuestion/RandomQuestion";
import LoadingSpinner from "../components/LoadingSpinner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Random Question - Byron Chang" },
    { name: "description", content: "Random Question Generator" },
  ];
}

export function hydrateFallback() {
  return <LoadingSpinner />;
}

export default function RandomQuestionPage() {
  return <RandomQuestion />;
}
