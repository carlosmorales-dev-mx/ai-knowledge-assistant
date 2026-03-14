import { create } from "zustand";

type ChatSessionStore = {
    activeSessionId?: string;
    setActiveSessionId: (sessionId?: string) => void;
};

export const useChatSessionStore = create<ChatSessionStore>((set) => ({
    activeSessionId: undefined,
    setActiveSessionId: (sessionId) => set({ activeSessionId: sessionId }),
}));