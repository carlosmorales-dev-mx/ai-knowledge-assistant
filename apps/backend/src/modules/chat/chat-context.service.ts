import { MessageRole } from "@prisma/client";

type ConversationMessage = {
    id: string;
    role: MessageRole;
    content: string;
    createdAt: Date;
};

type RetrievedSource = {
    id: string;
    documentId: string | null;
    filename: string | null;
    chunkIndex: number | null;
    content: string | null;
    distance: number | null;
};

export class ChatContextService {
    buildConversationHistory(messages: ConversationMessage[]) {
        if (!messages.length) {
            return "";
        }

        return messages
            .map((message) => {
                const speaker = message.role === MessageRole.USER ? "User" : "Assistant";
                return `${speaker}: ${message.content}`;
            })
            .join("\n\n");
    }

    buildSourcesContext(sources: RetrievedSource[]) {
        if (!sources.length) {
            return "";
        }

        return sources
            .map((source, index) => {
                const sourceNumber = index + 1;
                const filename = source.filename ?? "unknown";
                const chunkIndex = source.chunkIndex ?? -1;
                const content = source.content ?? "";

                return [
                    `[Source ${sourceNumber}]`,
                    `Filename: ${filename}`,
                    `Chunk index: ${chunkIndex}`,
                    "Content:",
                    content,
                ].join("\n");
            })
            .join("\n\n---\n\n");
    }

    buildPrompt(input: {
        message: string;
        history: string;
        context: string;
    }) {
        const { message, history, context } = input;

        return [
            "You are an AI Knowledge Assistant.",
            "Answer the user using the retrieved document context whenever possible.",
            "Use conversation history only to preserve continuity.",
            "Do not invent facts that are not supported by the retrieved context.",
            "If the answer is not contained in the context, clearly say that the answer is not available in the documents.",
            "Be concise, clear, and grounded.",
            "",
            "Conversation history:",
            history || "No previous conversation history.",
            "",
            "Retrieved document context:",
            context || "No retrieved document context.",
            "",
            "Current user question:",
            message,
        ].join("\n");
    }
}

export const chatContextService = new ChatContextService();