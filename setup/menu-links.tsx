import { appIcons } from "./app-icons";

export const menuLInks = [
  {
    title: "Home",
    icon: (
      <appIcons.home className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/",
    nid: "1",
  },

  {
    title: "Analyse",
    icon: (
      <appIcons.analise className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/analyse",
    nid: "2",
  },
  {
    title: "Security",
    icon: (
      <appIcons.encrypt className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/security",
    nid: "3",
  },
  {
    title: "Research",
    icon: (
      <appIcons.research className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/research",
    nid: "4",
  },
  {
    title: "Contact",
    icon: (
      <appIcons.contact className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/contact",
    nid: "5",
  },
];
