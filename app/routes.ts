import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("projects", "routes/projects.tsx"),
  route("random-question", "routes/randomQuestion.tsx"),
  route("contact", "routes/contact.tsx"),
  route("text-compare", "routes/textCompare.tsx"),
  route("bill-splitter", "routes/billSplitter.tsx"),
  route(
    ".well-known/appspecific/com.chrome.devtools.json",
    "routes/devtools.tsx",
  ),
] satisfies RouteConfig;
