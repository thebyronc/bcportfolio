import type { Route } from "./+types/home";
import { Projects } from "../projects/projects";
import { LoadingSpinner } from "../components/layout";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Projects" }, { name: "description", content: "Projects" }];
}

export function hydrateFallback() {
  return <LoadingSpinner message="Loading Projects..." />;
}

export default function Project() {
  return <Projects />;
}
