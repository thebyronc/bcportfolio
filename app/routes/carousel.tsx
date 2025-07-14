import type { Route } from "./+types/contact";
import Carousel from "../projects/carousel/Carousel";
import LoadingSpinner from "../components/LoadingSpinner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Carousel - Byron Chang" },
    { name: "description", content: "Carousel Byron Chang" },
  ];
}

export function hydrateFallback() {
  return <LoadingSpinner />;
}

export default function ContactPage() {
  return <Carousel />;
}
