import { appIcons } from "./app-icons";

export const menuLInks = [
  {
    title: "Home",
    icon: (
      <appIcons.home className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/",
  },

  {
    title: "Analyse",
    icon: (
      <appIcons.analise className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/analyse",
  },
  {
    title: "Security",
    icon: (
      <appIcons.encrypt className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/security",
  },
  {
    title: "Research",
    icon: (
      <appIcons.research className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/research",
  },
  {
    title: "Contact",
    icon: (
      <appIcons.contact className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/contact",
  },
];
