"use client";
import React, { forwardRef } from "react";
import { ReferenceItemType } from "@/types/chatResults";
import { cn } from "@/lib/utils";
import { appIcons } from "@/setup/app-icons";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

type Props = {
  className?: string;
  item: ReferenceItemType;
  variants: Variants;
  custom?: number;
};

const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
};

const ReferenceItem = forwardRef<HTMLDivElement, Props>(
  ({ className, item, variants, custom, ...props }, ref) => {
    const faviconUrl = getFaviconUrl(item.url);

    return (
      <motion.div
        variants={variants}
        custom={custom}
        ref={ref}
        className={cn(className, "w-full flex rounded-lg bg-muted/50 p-5")}
        {...props}
      >
        <a
          href={item.url}
          className="flex gap-2 items-center"
          target="_blank"
          rel="noreferrer"
        >
          {faviconUrl ? (
            <Image
              src={faviconUrl}
              alt="Favicon"
              className="w-6 h-6 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <appIcons.link className="text-green-500 hover:scale-110" />
          )}

          <div className="flex-grow flex flex-col gap-1">
            <p className="text-sm font-thin w-full">
              <span className="text-xs font-semibold text-green-500">
                title:
              </span>{" "}
              <span className="break-words">{item.title}</span>
            </p>
            <p className="text-sm font-normal text-foreground break-words">
              {item.url}
            </p>
          </div>
        </a>
      </motion.div>
    );
  }
);

ReferenceItem.displayName = "ReferenceItem";
export default ReferenceItem;
