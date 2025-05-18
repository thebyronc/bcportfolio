import type { Route } from "./+types/home";
import { Projects } from "../projects/projects";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Projects" }, { name: "description", content: "Projects" }];
}

export default function Project() {
  return <Projects />;
}
