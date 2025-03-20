export enum MessageRole {
    USER = 'user',
    ASSISTANT = 'assistant'
}

export type ThreadMessage = {
    _id: string;
    threadId: string
    role: MessageRole;
    content: string;
    createdAt?: string;
    updatedAt?: string;
}

export type Thread = {
    _id: string;
    userId: string;
    name: string
    lastMessage: ThreadMessage;
    assistantId: string;
    openAiThreadId: string;
    messages: ThreadMessage[];
    updatedAt?: string;
    createdAt?: string;
}
