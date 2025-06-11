import type { Route } from "./+types/home";
import { RandomQuestion } from "../projects/RandomQuestion/RandomQuestion";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RandomQuestion" },
    { name: "description", content: "Random Question" },
  ];
}

export default function RandomQuestionPage() {
  return <RandomQuestion />;
}
