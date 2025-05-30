import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Byron Chang" },
    { name: "description", content: "Byron Chang Software Engineer" },
  ];
}

export default function Home() {
  return <Welcome />;
}
