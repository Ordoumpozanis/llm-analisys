import React from "react";
import { MdSupportAgent } from "react-icons/md";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import { GiBookmark } from "react-icons/gi";
import { GrSystem } from "react-icons/gr";
import { RiSpeakLine } from "react-icons/ri";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiTool } from "react-icons/fi";
import { GlobalStatisticsType } from "@/types/chatResults";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

type ColorLettersProps = {
  globalStatistics: GlobalStatisticsType;
  className?: string;
  onReset: () => void;
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

function ColorLetters({
  className,
  globalStatistics,
  onReset,
}: ColorLettersProps) {
  const handleOnReset = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    onReset();
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-3 ",
        className ? className : "w-6/12"
      )}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        className={cn(
          "flex items-center gap-2 w/12 flex-wrap justify-center w-full border-2 border-dashed border-gray-200 rounded-lg p-8"
        )}
      >
        <motion.p variants={fadeInVariant} className="text-2xl" custom={0}>
          In your Chat you made
        </motion.p>

        <motion.div
          className="flex items-center gap-2"
          variants={fadeInVariant}
          custom={1}
        >
          <RiSpeakLine size={40} className="text-[#E23670]" />
          <p className="text-4xl text-[#E23670]">
            {globalStatistics.questions} questions
          </p>
        </motion.div>

        <motion.p variants={fadeInVariant} className="text-2xl" custom={2}>
          and Chat-GPT need
        </motion.p>

        <motion.p variants={fadeInVariant} className="text-2xl" custom={3}>
          to create
        </motion.p>

        <motion.div
          className="flex items-center gap-2"
          variants={fadeInVariant}
          custom={4}
        >
          <IoInformationCircleOutline size={40} className="text-[#AF57DB]" />
          <p className="text-4xl text-[#AF57DB]">
            {globalStatistics.responses} responses
          </p>
        </motion.div>

        <motion.p variants={fadeInVariant} className="text-2xl" custom={5}>
          in order to answer your questions.
        </motion.p>

        <motion.p variants={fadeInVariant} className="text-2xl" custom={6}>
          In Responces we found
        </motion.p>

        <motion.div
          className="flex items-center gap-2"
          variants={fadeInVariant}
          custom={7}
        >
          <GrSystem size={40} className="text-[#E88C30]" />
          <p className="text-4xl text-[#E88C30]">
            {globalStatistics.systemCount} System
          </p>
        </motion.div>

        <motion.p variants={fadeInVariant} className="text-2xl" custom={8}>
          commands,
        </motion.p>

        <motion.div
          className="flex items-center gap-2"
          variants={fadeInVariant}
          custom={9}
        >
          <MdSupportAgent size={40} className="text-[#2EB88A]" />
          <p className="text-4xl text-[#2EB88A]">
            {globalStatistics.assistant} Assistant
          </p>
        </motion.div>

        <motion.p variants={fadeInVariant} className="text-2xl" custom={10}>
          commands and
        </motion.p>

        <motion.div
          className="flex items-center gap-2"
          variants={fadeInVariant}
          custom={11}
        >
          <FiTool size={40} className="text-[#2662D9]" />
          <p className="text-4xl text-[#2662D9]">
            {globalStatistics.toolsCalled} Tools
          </p>
        </motion.div>

        <motion.p variants={fadeInVariant} className="text-2xl" custom={12}>
          usages.
        </motion.p>

        <motion.p variants={fadeInVariant} className="text-2xl" custom={13}>
          Also for your question we
        </motion.p>

        {globalStatistics.webSearches > 0 ? (
          <>
            <motion.p variants={fadeInVariant} className="text-2xl" custom={14}>
              we found that Chat-Gpt used
            </motion.p>

            <motion.div
              className="flex items-center gap-2"
              variants={fadeInVariant}
              custom={15}
            >
              <TbWorldWww size={40} className="text-[#E8D330]" />
              <p className="text-4xl text-[#E8D330]">
                {globalStatistics.webSearches} online searches
              </p>
            </motion.div>

            <motion.p variants={fadeInVariant} className="text-2xl" custom={16}>
              and
            </motion.p>

            <motion.div
              className="flex items-center gap-2"
              variants={fadeInVariant}
              custom={17}
            >
              <GiBookmark size={40} className="text-[#32CB89]" />
              <p className="text-4xl text-[#32CB89]">
                {globalStatistics.citations} citations
              </p>
            </motion.div>
          </>
        ) : (
          <>
            <motion.p variants={fadeInVariant} className="text-2xl" custom={18}>
              we found that GPT did not use any
            </motion.p>

            <motion.div
              className="flex items-center gap-2"
              variants={fadeInVariant}
              custom={19}
            >
              <TbWorldWww size={40} className="text-[#E8D330]" />
              <p className="text-4xl text-[#E8D330] "> online</p>
            </motion.div>

            <motion.p variants={fadeInVariant} className="text-2xl" custom={20}>
              searches and any
            </motion.p>

            <motion.div
              className="flex items-center gap-2"
              variants={fadeInVariant}
              custom={21}
            >
              <GiBookmark size={40} className="text-gray-400" />
              <p className="text-4xl text-gray-400">citations</p>
            </motion.div>

            <motion.p variants={fadeInVariant} className="text-2xl" custom={22}>
              used.
            </motion.p>
          </>
        )}

        {globalStatistics.images > 0 ? (
          <>
            <motion.p variants={fadeInVariant} className="text-2xl" custom={23}>
              Finally in your chat we found that
            </motion.p>

            <motion.div
              className="flex items-center gap-2"
              variants={fadeInVariant}
              custom={24}
            >
              <MdOutlinePhotoSizeSelectActual
                size={40}
                className="text-[#E88C30]"
              />
              <p className="text-4xl text-[#E23670]">
                {globalStatistics.images} Images
              </p>
            </motion.div>

            <motion.p variants={fadeInVariant} className="text-2xl" custom={25}>
              were included.
            </motion.p>
          </>
        ) : (
          <>
            <motion.p variants={fadeInVariant} className="text-2xl" custom={26}>
              We also did not find any
            </motion.p>

            <motion.div
              className="flex items-center gap-2"
              variants={fadeInVariant}
              custom={27}
            >
              <MdOutlinePhotoSizeSelectActual
                size={40}
                className="text-[#E23670]"
              />
              <p className="text-4xl text-[#E23670]">images</p>
            </motion.div>

            <motion.p variants={fadeInVariant} className="text-2xl" custom={28}>
              included
            </motion.p>
          </>
        )}
      </motion.div>
      <Button className="text-2xl p-2" onClick={handleOnReset}>
        Reset
      </Button>
    </div>
  );
}

export default ColorLetters;
