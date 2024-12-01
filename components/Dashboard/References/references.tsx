"use client";
import { cn } from "@/lib/utils";
import React from "react";
import RefereceItem from "./reference-item";
import { ReferenceItemType } from "@/types/chatResults";
import { motion } from "framer-motion";

type Props = {
  references: ReferenceItemType[];
  className?: string;
};

// Animation variants for fade-in effect
const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.2, // Adds delay for each element
      duration: 0.5,
    },
  }),
};

function ListOfReferences({ references, className }: Props) {
  return (
    <div className="w-full h-full overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        className={cn(className, "overflow-y-auto flex flex-col gap-3")}
      >
        <motion.h1
          custom={0}
          variants={fadeInVariant}
          className=" bg-gradient-to-br from-green-100 to-green-400 py-4 bg-clip-text text-center text-xl lg:text-4xl font-medium tracking-tight text-transparent "
        >
          {references.length > 0
            ? "Citations found in chat"
            : "No Citations found in chat"}
        </motion.h1>

        {references.map((item, key) => (
          <RefereceItem
            key={key}
            item={item}
            variants={fadeInVariant}
            custom={key + 1}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default ListOfReferences;
