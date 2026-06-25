import type { ComponentType, SVGProps } from "react";

export interface NavigationItem {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  children?: { href: string; label: string }[];
}
