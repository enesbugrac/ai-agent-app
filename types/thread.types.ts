import { Agent } from "@/data/agents";
import { PossibleToolJson } from "./tools.types";


export enum MessageRole {
    USER = 'user',
    ASSISTANT = 'assistant'
}

export type ThreadMessage = {
    _id: string;
    threadId: string
    role: MessageRole;
    content: string;
    toolJson?: PossibleToolJson
    createdAt?: string;
    updatedAt?: string;
}

export type Thread = {
    _id: string;
    userId: string;
    name: string
    agent: Agent;
    openAiThreadId: string;
    messages: ThreadMessage[];
    updatedAt?: string;
    createdAt?: string;
}


export type ThreadWithoutMessages = Omit<Thread, 'messages'>;
