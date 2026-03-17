export type ChatSource = {
    id: string;
    documentId: string;
    filename: string;
    chunkIndex: number;
    content: string;
    distance?: number | null;
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