import type { Route } from "./+types/home";
import { BillSplitter } from "../projects/billSplitter/BillSplitter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bill Splitter" },
    {
      name: "description",
      content: "Split bills and calculate totals for each person",
    },
  ];
}

export default function BillSplitterRoute() {
  return <BillSplitter />;
}
