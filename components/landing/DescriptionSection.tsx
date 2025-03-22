import React from "react";
import TypingText from "../TypingText";

const DescriptionSection = () => {
  const infoText =
    "Implementing an AI solution is not just a matter of technology. It must be an integral part of your business processes while respecting your company's culture. With Skazy AI, your AI strategy evolves in line with your ambitions.";

  return (
    <section className="h-[100vh] flex flex-col gap-4 items-center justify-center text-center text-white">
      <h1 className="max-w-7xl w-full h-[40%] flex items-center justify-center px-[10%] relative text-white text-4xl font-syne leading-[1.3] tracking-wide">
        <TypingText text={infoText} />

        <div className="curved-line absolute top-0 left-0" />
        <div className="curved-line-reverse absolute bottom-0 right-0" />
      </h1>
    </section>
  );
};

export default DescriptionSection;
