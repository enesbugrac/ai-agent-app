import { FaUser, FaEnvelope, FaFileAlt, FaCode } from "react-icons/fa";
import { IconType } from "react-icons";

export interface Prompt {
  icon: IconType;
  text: string;
  onClick?: () => void;
}

export const prompts: Prompt[] = [
  {
    icon: FaUser,
    text: "Write a to-do list for a personal project or task",
  },
  {
    icon: FaEnvelope,
    text: "Generate an email reply to a job offer",
  },
  {
    icon: FaFileAlt,
    text: "Summarize this article or text for me in one paragraph",
  },
  {
    icon: FaCode,
    text: "How does AI work in a technical capacity",
  },
]; 