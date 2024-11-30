import { IoSettingsOutline } from "react-icons/io5"; //settings
import { RiBookOpenLine } from "react-icons/ri"; //book
import { BsBook } from "react-icons/bs"; //book 2
import { SlMagnifier } from "react-icons/sl"; // analise
import { IoStatsChartOutline } from "react-icons/io5"; // report
import { IconType } from "react-icons/lib";
import { MdOutlineEnhancedEncryption } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { AiOutlineExperiment } from "react-icons/ai";
import { IoIosContact } from "react-icons/io";

export const appIcons: Record<string, IconType> = {
  settings: IoSettingsOutline,
  book: RiBookOpenLine,
  book2: BsBook,
  analise: SlMagnifier,
  report: IoStatsChartOutline,
  encrypt: MdOutlineEnhancedEncryption,
  home: AiOutlineHome,
  research: AiOutlineExperiment,
  contact: IoIosContact,
};
