import React from 'react'

interface PromptButtonProps {
  text: string;
}

const PromptButton = ({ text }: PromptButtonProps) => (
    <button className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-primary transition-colors group min-w-[300px]">
      <p className="text-white text-sm group-hover:text-black transition-colors">
      {text}
    </p>
  </button>
);

export default PromptButton;
