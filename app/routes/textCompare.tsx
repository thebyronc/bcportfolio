import type { Route } from "./+types/home";
import { TextCompare } from "../projects/TextCompare/TextCompare";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Text Comparitor" },
    { name: "description", content: "Byron Chang - Software Engineer" },
  ];
}

export default function Home() {
  return <TextCompare />;
}
