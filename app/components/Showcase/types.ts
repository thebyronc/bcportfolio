import type { BaseComponentProps } from "../../types";
import type { ReactNode } from "react";

export interface ShowcaseItem {
  title: string;
  description: string;
  link?: string;
  external?: boolean;
  onClick?: () => void;
  image?: string | ReactNode;
  hoverImage?: string | ReactNode;
  imageAlt?: string;
  techStack?: string[];
}

export interface ShowcaseProps extends BaseComponentProps {
  items: ShowcaseItem[];
  title?: string;
  subtitle?: string;
}
