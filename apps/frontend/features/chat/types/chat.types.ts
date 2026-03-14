export type ChatSource = {
    documentId?: string;
    documentName?: string;
    chunkId?: string;
    content?: string;
};

export type SendChatMessageRequest = {
    message: string;
    sessionId?: string;
};

export type SendChatMessageResponse = {
    data: {
        sessionId: string;
        answer: string | null;
        fallback: string | null;
        sources: ChatSource[];
    };
};