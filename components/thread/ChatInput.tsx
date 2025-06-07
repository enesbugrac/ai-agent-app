import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { IoSend } from 'react-icons/io5';
import { useAuthStore } from '@/store/useStore'; 
import { useModalStore } from '@/store/modalStore'; 
import WhitelistForm from '@/components/whitelist/WhitelistForm';
import SuccessMessage from '@/components/common/SuccessMessage';
import { useInput } from '@/hooks/input.hooks';

type ChatInputProps = {
  onSend: (input:string) => void;
  isSending: boolean;
  placeholder?: string;
  inputContainerRef?: React.RefObject<HTMLDivElement | null>; 
  minRows?: number;
  maxRows?: number;
};

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isSending,
  placeholder = "Ask whatever you want...",
  inputContainerRef,
  minRows = 2,
  maxRows = 10,
}) => {
  const { input, setInput } = useInput();

  const { user } = useAuthStore();
  const { openModal } = useModalStore();
  
  // Get openModal function

  const handleSend = () => {
    if (user?.credits === 0) {
      openModal(
        <WhitelistForm 
          description="You've run out of credits. Join the whitelist to get more!" 
          successContent={
            <SuccessMessage
              title="You're successfully joined the whitelist to get more credits!"
              message="Thank you for joining. We'll notify you when you have more credits."
            />
          }
          existingEmailSuccessContent={
            <SuccessMessage
              title="You're already on the list!"
              message="Thank you for joining. We'll notify you when you have more credits."
            />
          }
        />
      ); 
    } else {
      console.log(input, onSend)
      onSend(input); 
      setInput("");
    }
  };
   
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending && input.trim()) {
      e.preventDefault();
      handleSend(); 
    }
  };
  
  return (
    <div
      ref={inputContainerRef}
      className=" flex flex-col items-end justify-between bg-[#1A1D23] rounded-2xl shadow-sm w-full transition-transform duration-300 p-4 my-2" 
    >
      <TextareaAutosize
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        minRows={minRows}
        maxRows={maxRows}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none text-secondary placeholder-text-muted text-sm resize-none mb-2" 
      />
      <div className="flex items-center justify-between pt-2 w-full">
        <div className="px-2 py-1 rounded-md bg-primary flex items-center ">
          <span className="text-black text-xs">{user?.credits ?? 0} credits</span>
        </div>

      <button
          disabled={isSending || !input.trim()} 
          onClick={handleSend}
          className={`w-8 h-8 rounded-lg bg-primary text-background hover:bg-primary/90 transition-all flex items-center justify-center ${
            (isSending || !input.trim()) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <IoSend className="text-md" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
