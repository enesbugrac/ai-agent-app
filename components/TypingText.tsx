import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface TypingTextProps {
  text?: string;
}

const TypingText = ({ text }: TypingTextProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const textRef = useRef(null);

  const words = text?.split(" ");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView && currentWordIndex < (words?.length ?? 0)) {
      const timeout = setTimeout(() => {
        setCurrentWordIndex((prev) => prev + 1);
      }, 120);

      return () => clearTimeout(timeout);
    }
  }, [currentWordIndex, words?.length, isInView]);

  return (
    <motion.div
      ref={textRef}
      className="relative text-white text-4xl font-syne leading-[1.3] tracking-wide min-w-full min-h-[250px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-full w-full">
        {words?.map((word, index) => (
          <span
            key={index}
            className="mr-[0.3em] inline-block transition-all duration-300"
            style={{
              opacity: index < currentWordIndex ? 1 : 0.2,
              color: index < currentWordIndex ? "white" : "rgba(255, 255, 255, 0.5)",
            }}
          >
            {word}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default TypingText;
