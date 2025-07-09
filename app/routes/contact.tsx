import type { Route } from "./+types/home";
import Contact from "../pages/Contact";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Contacts" }, { name: "description", content: "Contacts" }];
}

export default function ContactPage() {
  return <Contact />;
}
