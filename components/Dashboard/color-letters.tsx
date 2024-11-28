import React from "react";
import { MdSupportAgent } from "react-icons/md";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import { GiBookmark } from "react-icons/gi";
import { GrSystem } from "react-icons/gr";
import { RiSpeakLine } from "react-icons/ri";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiTool } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { GlobalStatisticsType, SessionInfoType } from "@/types/chatResults";

type ColorLettersProps = {
  globalStatistics: GlobalStatisticsType;
  className?: string;
  sessionInfo: SessionInfoType;
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
  sessionInfo,
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
        "flex flex-col justify-center items-center gap- lg:gap-3 ",
        className ? className : "w-11/12 lg:w-6/12"
      )}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        className={cn("flex items-center gap-2 justify-center w-full flex-col")}
      >
        <motion.p
          variants={fadeInVariant}
          className="text-md lg:text-4xl  underline underline-offset-2"
          custom={0}
        >
          {sessionInfo.Title}{" "}
        </motion.p>
        <div
          className={cn(
            "flex items-center gap-2  flex-wrap justify-center w-full border-2 border-dashed border-gray-200 rounded-lg p-8"
          )}
        >
          <motion.p
            variants={fadeInVariant}
            className="text- lg:text-2xl"
            custom={1}
          >
            In this chat you made{" "}
          </motion.p>

          <motion.div
            className="flex items-center gap-0 lg:gap-2"
            variants={fadeInVariant}
            custom={2}
          >
            <RiSpeakLine
              size={40}
              className="text-[#E23670] scale-50 lg:scale-100"
            />
            <p className="text-md lg:text-4xl text-[#E23670]">
              {globalStatistics.questions} questions
            </p>
          </motion.div>

          <motion.p
            variants={fadeInVariant}
            className="text- lg:text-2xl"
            custom={3}
          >
            and Chat-GPT need
          </motion.p>

          <motion.p
            variants={fadeInVariant}
            className="text- lg:text-2xl"
            custom={4}
          >
            to create
          </motion.p>

          <motion.div
            className="flex items-center gap-0 lg:gap-2"
            variants={fadeInVariant}
            custom={5}
          >
            <IoInformationCircleOutline
              size={40}
              className="scale-50 lg:scale-1 text-[#AF57DB]"
            />
            <p className="text-md lg:text-4xl text-[#AF57DB]">
              {globalStatistics.responses} responses
            </p>
          </motion.div>

          <motion.p
            variants={fadeInVariant}
            className="text- lg:text-2xl"
            custom={6}
          >
            in order to answer your questions.
          </motion.p>

          <motion.p
            variants={fadeInVariant}
            className="text- lg:text-2xl"
            custom={7}
          >
            In Responces we found
          </motion.p>

          <motion.div
            className="flex items-center gap-0 lg:gap-2"
            variants={fadeInVariant}
            custom={8}
          >
            <GrSystem
              size={40}
              className="scale-50 lg:scale-1 text-[#E88C30]"
            />
            <p className="text-md lg:text-4xl text-[#E88C30]">
              {globalStatistics.systemCount} System
            </p>
          </motion.div>

          <motion.p
            variants={fadeInVariant}
            className="text- lg:text-2xl"
            custom={9}
          >
            commands,
          </motion.p>

          <motion.div
            className="flex items-center gap-0 lg:gap-2"
            variants={fadeInVariant}
            custom={10}
          >
            <MdSupportAgent
              size={40}
              className="scale-50 lg:scale-1 text-[#2EB88A]"
            />
            <p className="text-md lg:text-4xl text-[#2EB88A]">
              {globalStatistics.assistant} Assistant
            </p>
          </motion.div>

          <motion.p
            variants={fadeInVariant}
            className="text- lg:text-2xl"
            custom={11}
          >
            commands and
          </motion.p>

          <motion.div
            className="flex items-center gap-0 lg:gap-2"
            variants={fadeInVariant}
            custom={12}
          >
            <FiTool size={40} className="scale-50 lg:scale-1 text-[#2662D9]" />
            <p className="text-md lg:text-4xl text-[#2662D9]">
              {globalStatistics.toolsCalled} Tools
            </p>
          </motion.div>

          <motion.p
            variants={fadeInVariant}
            className="text- lg:text-2xl"
            custom={13}
          >
            usages.
          </motion.p>

          <motion.p
            variants={fadeInVariant}
            className="text- lg:text-2xl"
            custom={14}
          >
            Also for your question we
          </motion.p>

          {globalStatistics.webSearches > 0 ? (
            <>
              <motion.p
                variants={fadeInVariant}
                className="text- lg:text-2xl"
                custom={15}
              >
                we found that Chat-Gpt used
              </motion.p>

              <motion.div
                className="flex items-center gap-2"
                variants={fadeInVariant}
                custom={16}
              >
                <TbWorldWww
                  size={40}
                  className="scale-50 lg:scale-1 text-[#E8D330]"
                />
                <p className="text-md lg:text-4xl text-[#E8D330]">
                  {globalStatistics.webSearches} online searches
                </p>
              </motion.div>

              <motion.p
                variants={fadeInVariant}
                className="text- lg:text-2xl"
                custom={17}
              >
                and
              </motion.p>

              <motion.div
                className="flex items-center gap-2"
                variants={fadeInVariant}
                custom={18}
              >
                <GiBookmark
                  size={40}
                  className="scale-50 lg:scale-1 text-[#32CB89]"
                />
                <p className="text-md lg:text-4xl text-[#32CB89]">
                  {globalStatistics.citations} citations
                </p>
              </motion.div>
            </>
          ) : (
            <>
              <motion.p
                variants={fadeInVariant}
                className="text- lg:text-2xl"
                custom={19}
              >
                we found that GPT did not use any
              </motion.p>

              <motion.div
                className="flex items-center gap-2"
                variants={fadeInVariant}
                custom={20}
              >
                <TbWorldWww
                  size={40}
                  className="scale-50 lg:scale-1 text-[#E8D330]"
                />
                <p className="text-md lg:text-4xl text-[#E8D330] "> online</p>
              </motion.div>

              <motion.p
                variants={fadeInVariant}
                className="text- lg:text-2xl"
                custom={21}
              >
                searches and any
              </motion.p>

              <motion.div
                className="flex items-center gap-2"
                variants={fadeInVariant}
                custom={22}
              >
                <GiBookmark
                  size={40}
                  className="scale-50 lg:scale-1 text-gray-400"
                />
                <p className="text-md lg:text-4xl text-gray-400">citations</p>
              </motion.div>

              <motion.p
                variants={fadeInVariant}
                className="text- lg:text-2xl"
                custom={23}
              >
                used.
              </motion.p>
            </>
          )}

          {globalStatistics.images > 0 ? (
            <>
              <motion.p
                variants={fadeInVariant}
                className="text- lg:text-2xl"
                custom={24}
              >
                Finally in your chat we found that
              </motion.p>

              <motion.div
                className="flex items-center gap-2"
                variants={fadeInVariant}
                custom={25}
              >
                <MdOutlinePhotoSizeSelectActual
                  size={40}
                  className="text-[#E88C30]"
                />
                <p className="text-md lg:text-4xl text-[#E23670]">
                  {globalStatistics.images} Images
                </p>
              </motion.div>

              <motion.p
                variants={fadeInVariant}
                className="text- lg:text-2xl"
                custom={26}
              >
                were included.
              </motion.p>
            </>
          ) : (
            <>
              <motion.p
                variants={fadeInVariant}
                className="text- lg:text-2xl"
                custom={27}
              >
                We also did not find any
              </motion.p>

              <motion.div
                className="flex items-center gap-2"
                variants={fadeInVariant}
                custom={28}
              >
                <MdOutlinePhotoSizeSelectActual
                  size={40}
                  className="scale-50 lg:scale-100 text-[#E23670]"
                />
                <p className="text-md lg:text-4xl text-[#E23670]">images</p>
              </motion.div>

              <motion.p
                variants={fadeInVariant}
                className="text- lg:text-2xl"
                custom={29}
              >
                included
              </motion.p>
            </>
          )}
        </div>
      </motion.div>

      <Button className="text- lg:text-2xl p-2" onClick={handleOnReset}>
        Reset
      </Button>
    </div>
  );
}

export default ColorLetters;
