import { ImageToBase64 } from "~/projects/imageToBase64/imageToBase64";
import { LoadingSpinner } from "../components/layout";

export function hydrateFallback() {
  return <LoadingSpinner message="Loading Image Converter..." />;
}

export default function ImageToBase64Route() {
  return <ImageToBase64 />;
}
