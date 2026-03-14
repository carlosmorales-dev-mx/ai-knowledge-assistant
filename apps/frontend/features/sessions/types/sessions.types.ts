export type ChatSession = {
    id: string;
    title: string | null;
    createdAt: string;
    updatedAt: string;
};

export type GetChatSessionsResponse = {
    data: ChatSession[];
};

export type SessionMessage = {
    id: string;
    role: "USER" | "ASSISTANT";
    content: string;
    createdAt: string;
};

export type GetSessionMessagesResponse = {
    data: SessionMessage[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
};