import { useState } from "react";

export const useInput = () => {
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    return { input, setInput, isTyping, setIsTyping };
};
