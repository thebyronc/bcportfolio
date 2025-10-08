import type { Route } from "./+types/home";
import Contact from "../pages/Contact";
import { LoadingSpinner } from "../components/layout";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Contacts" }, { name: "description", content: "Contacts" }];
}

export function hydrateFallback() {
  return <LoadingSpinner message="Loading Contact..." />;
}

export default function ContactPage() {
  return <Contact />;
}
