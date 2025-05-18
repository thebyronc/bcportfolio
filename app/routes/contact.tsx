import type { Route } from "./+types/home";
import { Contact } from "../contact/contact";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Contacts" }, { name: "description", content: "Contacts" }];
}

export default function ContactPage() {
  return <Contact />;
}
