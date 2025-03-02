import { IconType } from "react-icons";

interface PromptCardProps {
  icon: IconType;
  text: string;
  onClick?: () => void;
}

export default function PromptCard({ icon: Icon, text, onClick }: PromptCardProps) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col p-4 justify-between rounded-2xl border border-border bg-[#1A1D23] text-center transition-colors h-[140px] hover:border-tertiary/20 group"
    >
      <p className="text-xs text-secondary group-hover:text-tertiary text-start transition-colors">
        {text}
      </p>

      <Icon className="text-xl text-secondary group-hover:text-tertiary transition-colors" />

    </button>
  );
} 