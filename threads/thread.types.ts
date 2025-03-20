export enum MessageRole {
    USER = 'user',
    ASSISTANT = 'assistant'
}

export type Message = {
    threadId: string
    role: MessageRole;
    content: string;
}

export type Thread = {
    userId: string;
    name: string
    lastMessage: Message;
    assistantId: string;
    openAiThreadId: string;
    messages: string[];
}