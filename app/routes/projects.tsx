import type { Route } from "./+types/projects";
import { Projects } from "../projects/projects";
import LoadingSpinner from "../components/LoadingSpinner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projects - Byron Chang" },
    { name: "description", content: "Projects by Byron Chang" },
  ];
}

export function hydrateFallback() {
  return <LoadingSpinner />;
}

export default function ProjectsPage() {
  return <Projects />;
}
