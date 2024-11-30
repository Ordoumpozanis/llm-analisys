"use client";
import React from "react";
import { motion } from "framer-motion";
import { CiLinkedin } from "react-icons/ci";

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

export default function Contact() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start ">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        className={
          "max-w-4xl antialiased relative p-4 pt-0 flex flex-col gap-2 items-center justify-center h-full "
        }
      >
        <motion.p
          variants={fadeInVariant}
          custom={0}
          className="underline text-md"
        >
          Researcher Informations
        </motion.p>
        <motion.p
          variants={fadeInVariant}
          custom={1}
          className="font-semibold text-xl text-cyan-500 "
        >
          Kostas Ordoumpozanis
        </motion.p>
        <motion.p variants={fadeInVariant} custom={2} className="text-sm">
          PhD Student
        </motion.p>
        <motion.p variants={fadeInVariant} custom={3} className="text-sm ">
          Email: koordou@aegean.gr
        </motion.p>

        <motion.div
          variants={fadeInVariant}
          custom={4}
          className="rounded-full overflow-hidden"
        >
          <a href="https://www.linkedin.com/in/ordoumpozanis-konstantinos/">
            <CiLinkedin
              size={32}
              className="text-cyan-500 scale-50 lg:scale-100"
            />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
