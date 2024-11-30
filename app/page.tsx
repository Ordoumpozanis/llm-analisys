"use client";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { menuLInks } from "@/setup/menu-links";
export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-xl lg:text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Chatting with GPT
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className=" bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-xl lg:text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Your Environmental Impact{" "}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.8,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex justify-center items-center gap-4 mt-10"
        >
          <Link href={menuLInks[1].href}>
            <Button
              variant="default"
              className="border-2 border-green-500 rounded-lg bg-background text-green-500 hover:bg-foreground/70 hover:text-background"
              size="lg"
            >
              See
            </Button>
          </Link>

          <motion.h3
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className=" bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-md lg:text-lg font-medium tracking-tight text-transparent "
          >
            The invisible side of AI
          </motion.h3>
        </motion.div>
      </LampContainer>
    </div>
  );
}
