import type { Route } from "./+types/contact";
import Contact from "../pages/Contact";
import LoadingSpinner from "../components/LoadingSpinner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact - Byron Chang" },
    { name: "description", content: "Contact Byron Chang" },
  ];
}

export function hydrateFallback() {
  return <LoadingSpinner />;
}

export default function ContactPage() {
  return <Contact />;
}
