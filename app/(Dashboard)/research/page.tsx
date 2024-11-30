"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { LampContainer } from "@/components/ui/lamp";
export default function AppScope() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start ">
      <div className="max-w-4xl mx-auto antialiased relative p-4 pt-0 flex flex-col gap-2">
        {/* Page Title */}
        <LampContainer
          fromColor="from-cyan-500"
          toColor="to-cyan-500"
          bgColor="bg-cyan-400"
        >
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className=" bg-gradient-to-br from-slate-300 to-cyan-600 py-4 bg-clip-text text-center text-xl lg:text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          >
            Understanding the Scope of This Application
          </motion.h1>
        </LampContainer>

        {scopeContent.map((item, index) => (
          <div
            key={`content-${index}`}
            className="flex flex-col items-center gap-6 mb-16"
          >
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3, duration: 0.6 }}
              className="bg-gradient-to-br from-slate-300 to-cyan-600 py-4 bg-clip-text text-center text-lg md:text-xl lg:text-2xl font-medium tracking-tight text-transparent "
            >
              {item.title}
            </motion.h2>

            {/* Image */}
            {item.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.4, duration: 0.6 }}
                className="w-full lg:w-3/4 "
              >
                <Image
                  src={item.image}
                  alt={`${item.title} illustration`}
                  height={1000}
                  width={1600}
                  className="rounded-lg object-cover shadow-lg"
                />
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3, duration: 0.6 }}
              className="text-lg prose dark:prose-invert lg:text-left leading-relaxed"
            >
              {item.description}
            </motion.div>
          </div>
        ))}

        <p className=" text-sm text-center">
          <span className="font-bold text-cyan-500 capitalize">NOTICE</span>{" "}
          {`The
          energy estimation provided is not precise and should be considered as
          an indication only. It is based on data gathered from various research
          studies and multiple models, none of which specifically refer to
          OpenAI’s models. The scope of this app is to demonstrate how AI has an
          invisible but significant impact on the environment, highlighting the
          hidden energy consumption associated with AI technologies. Currently,
          we have included the ChatGPT tool as one of the most widely used
          models. In the future, we plan to incorporate more large language
          models (LLMs) to further enhance the estimation.`}
        </p>
      </div>
    </div>
  );
}

const scopeContent = [
  {
    title: "Studying How LLMs Handle User Interactions",
    description: (
      <>
        <p className="mb-6">
          {`Have you ever wondered what happens inside a language model like
          ChatGPT when you send a message? While it might seem like a single,
          seamless response, the process involves multiple hidden steps. Every
          question or prompt you submit starts a conversation not only with you
          but also within the model itself, as it decides how to best generate
          an answer.`}
        </p>
        <p className="mb-6">
          {`This research focuses on studying these internal processes.
          Specifically, we look at how many "hidden steps" or internal exchanges
          the model takes before producing a reply. For example, when you ask a
          question, the LLM might break it down, reason through possibilities,
          and refine its response – all of which require processing power and
          generate internal activity.`}
        </p>
        <p className="mb-6">
          {`By analyzing these patterns, we aim to measure how efficiently the
          model operates. We’re not studying the content of user conversations;
          instead, we focus on metrics like the average number of user messages
          per session, the hidden steps or internal exchanges the model performs
          in response to inputs, and the total text length exchanged. This helps
          us understand the complexity of LLM behavior while respecting user
          privacy.`}
        </p>
        <p className="mb-6">
          {`Understanding these patterns helps us evaluate and improve the
          performance of language models. By identifying areas where internal
          interactions can be optimized, we aim to make these tools faster,
          smarter, and more resource-efficient.`}
        </p>
      </>
    ),
    badge: "Interaction Analysis",
    image: "/images/research1.webp", // Replace with your generated image
  },
  {
    title: "Measuring Internal Processes and Message Counts",
    description: (
      <>
        <p className="mb-6">
          {`Every time you send a message to an LLM, there’s a series of hidden
          steps behind the scenes. What seems like a single, smooth response is
          actually the result of multiple internal exchanges within the model.
          These are necessary to interpret your input, retrieve relevant
          information, and compose a meaningful reply.`}
        </p>
        <p className="mb-6">
          {`For instance, when you ask a complex question, the model might divide
          it into smaller parts, answer each one, and then assemble a coherent
          response. These steps generate "hidden exchanges" within the model,
          which allow it to refine and deliver the final output.`}
        </p>
        <p className="mb-6">
          {`Our research counts these internal exchanges and compares them to the
          messages exchanged with the user. By analyzing this data, we can
          better understand how many steps are typically required for different
          user inputs. This provides insights into the computational effort
          involved and highlights areas for streamlining.`}
        </p>
        <p className="mb-6">
          {`We also track the total number of messages in a session – from both
          the user and within the model – to calculate averages and identify
          patterns. For example: How many messages does a user send in a typical
          session? How does that compare to the model’s hidden exchanges? By
          studying these metrics, we aim to improve LLM efficiency while
          maintaining user privacy.`}
        </p>
      </>
    ),
    badge: "Internal Metrics",
    image: "/images/research2.webp", // Replace with your generated image
  },
  {
    title: "Calculating Energy Consumption of LLM Sessions",
    description: (
      <>
        <p className="mb-6">
          {`One of the most important aspects of this research is understanding
          the environmental impact of using large language models. Every
          interaction with an LLM consumes computational resources, which in
          turn use energy. The more complex the interaction – and the more
          hidden steps the model takes – the higher the energy cost.`}
        </p>
        <p className="mb-6">
          {` Our study estimates the total energy consumption of LLM sessions by
          analyzing the number of user messages, the internal exchanges, and the
          tokens processed. For example, based on research from the 2024
          Research Paper`}{" "}
          <strong>
            <a href="https://arxiv.org/abs/2311.16863">
              {`"Power Hungry Processing: Watts Driving the Cost of AI
              Deployment?"`}
            </a>
          </strong>{" "}
          each message consumes approximately <strong>0.049 Wh</strong> of
          energy and each image generation consumes about{" "}
          <strong>2.907 Wh</strong>. For web search, latest available data is on
          2019 estimating each query uses about{" "}
          <strong>
            {" "}
            <a href="https://www.sciencedirect.com/science/article/pii/S2542435123003653">
              0.3 Wh
            </a>
          </strong>
          .
        </p>
        <p className="mb-6">
          {` To put this into perspective, a session with 50 messages (including
          internal and user exchanges) would consume roughly 3 Wh – enough to
          charge 16% of a mobile's phone battery. While this might seem minimal
          for a single session, it adds up quickly with millions of interactions
          occurring daily worldwide.`}
        </p>
        <p className="mb-6">
          {`  By understanding the energy footprint of LLM usage, we can work toward
          making these models more energy-efficient. This involves finding ways
          to streamline hidden processes, reducing computational overhead while
          maintaining high-quality responses. Our goal is to minimize the
          environmental impact of LLMs without compromising their usefulness.`}
        </p>
      </>
    ),
    badge: "Energy Impact",
    image: "/images/research3.webp", // Replace with your generated image
  },
];
