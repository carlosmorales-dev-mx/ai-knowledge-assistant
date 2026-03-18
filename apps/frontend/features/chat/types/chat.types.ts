export type ChatSource = {
    id: string;
    documentId: string | null;
    filename: string | null;
    chunkIndex: number | null;
    content: string | null;
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