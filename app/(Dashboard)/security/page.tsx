"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  AiOutlineLink,
  AiOutlineCloud,
  AiOutlineMobile,
  AiOutlineLock,
  AiOutlineBarChart,
  AiOutlineSync,
  AiOutlineDatabase,
} from "react-icons/ai";
import { FaArrowDown } from "react-icons/fa";
import { LampContainer } from "@/components/ui/lamp";

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
    },
  }),
};

function HowItWorks() {
  const steps = [
    {
      icon: <AiOutlineLink size={32} />,
      title: "1. You Provide a Conversation URL",
      description:
        "The process begins when you share a URL containing your conversation with an LLM (like GPT). This URL allows us to fetch the data needed to calculate token statistics.",
    },
    {
      icon: <AiOutlineCloud size={32} />,
      title: "2. The URL Reaches Our Server",
      description:
        "Your conversation URL is sent to our secure server, where the conversation data is retrieved. This process ensures the system works seamlessly without accessing any sensitive information.",
    },
    {
      icon: <AiOutlineMobile size={32} />,
      title: "3. Data Sent Back to Your Device",
      description:
        "After fetching the data, the server sends it back to your device (whether mobile or desktop). From this point forward, all the processing takes place on your device.",
    },
    {
      icon: <AiOutlineLock size={32} />,
      title: "4. Processing on Your Device",
      description:
        "On your device, the text is transformed into non-reversible numbers called tokens. These tokens represent the length of the text but cannot be converted back into words, ensuring complete privacy.",
    },
    {
      icon: <AiOutlineBarChart size={32} />,
      title: "5. Statistics Are Created",
      description:
        "Using these tokens, your device calculates statistics, such as the total number of tokens in the conversation, to provide you with insights.",
    },
    {
      icon: <AiOutlineSync size={32} />,
      title: "6. Sending Back to Our Server",
      description:
        "The processed document—containing only the token counts and statistics—is sent back to our server. At no point does the server store any of your original text.",
    },
    {
      icon: <AiOutlineDatabase size={32} />,
      title: "7. What We Store",
      description: (
        <>
          On our server, we store only a few non-personalized details, such as:
          <ul className="list-disc list-inside ml-6">
            <li>The title of the conversation</li>
            <li>Your country and city</li>
            <li>
              The flow of the conversation (messages and responses) for
              statistics generation
            </li>
          </ul>
          This data cannot be traced back to you personally.
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-4xl text-center pt-24">
        <LampContainer
          fromColor="from-pink-500"
          toColor="to-pink-500"
          bgColor="bg-pink-400"
        >
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className=" bg-gradient-to-br from-pink-100 to-pink-400 py-4 bg-clip-text text-center text-xl lg:text-4xl font-medium tracking-tight text-transparent "
          >
            How Our System Works
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className=" bg-gradient-to-br from-pink-100 to-pink-400  py-4 bg-clip-text text-center text-sm lg:text-xl font-medium tracking-tight text-transparent "
          >
            We prioritize your privacy. Here’s a simple explanation of how we
            process your data without ever accessing its content.
          </motion.h1>
        </LampContainer>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl mt-8 space-y-8 leading-relaxed text-md text-justify">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeInVariant}
              custom={index + 2}
              className="flex flex-col items-start"
            >
              <div className="flex items-center gap-4">
                {step.icon}
                <h2 className="bg-gradient-to-br from-pink-100 to-pink-400  py-4 bg-clip-text text-center text-sm lg:text-xl font-medium tracking-tight text-transparent">
                  {step.title}
                </h2>
              </div>
              <div className="mt-2">{step.description}</div>
            </motion.section>

            {index < steps.length - 1 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInVariant}
                custom={index + 2.5}
                className="flex justify-center my-4"
              >
                <FaArrowDown size={24} className="  text-pink-300 " />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariant}
          custom={steps.length + 2}
        >
          Your privacy is our top priority.{" "}
          <strong>We cannot see your messages or the LLM responses.</strong>
        </motion.div>
      </footer>
    </div>
  );
}

export default HowItWorks;
