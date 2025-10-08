import type { Route } from "./+types/home";
import { BillSplitter } from "../projects/billSplitter/BillSplitter";
import { LoadingSpinner } from "../components/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bill Splitter" },
    {
      name: "description",
      content: "Split bills and calculate totals for each person",
    },
  ];
}

export function hydrateFallback() {
  return <LoadingSpinner message="Loading Bill Splitter..." />;
}

export default function BillSplitterRoute() {
  return <BillSplitter />;
}
