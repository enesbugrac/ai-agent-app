import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { IoSend } from 'react-icons/io5';
import { useAuthStore } from '@/store/useStore';

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
  placeholder?: string;
  inputContainerRef?: React.RefObject<HTMLDivElement | null>; 
  minRows?: number;
  maxRows?: number;
};

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isSending,
  placeholder = "Ask whatever you want...",
  inputContainerRef,
  minRows = 2,
  maxRows = 10,
}) => {

  const {user} = useAuthStore();
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      ref={inputContainerRef}
      className="flex flex-col items-end bg-[#1A1D23] rounded-2xl shadow-sm w-full transition-transform duration-300 p-4" 
    >
      <TextareaAutosize
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        minRows={minRows}
        maxRows={maxRows}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none text-secondary placeholder-text-muted text-sm resize-none mb-2" 
      />
      <div className="flex items-center justify-between pt-2 w-full">
        <div className="px-2 py-1 rounded-md bg-primary flex items-center ">
          <span className="text-black text-sm">{user?.credits ?? 0} credits</span>
        </div>

      <button
          disabled={isSending || !value.trim()} 
          onClick={onSend}
          className={`w-8 h-8 rounded-lg bg-primary text-background hover:bg-primary/90 transition-all flex items-center justify-center ${
            (isSending || !value.trim()) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <IoSend className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
