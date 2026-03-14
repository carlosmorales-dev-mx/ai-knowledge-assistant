export type ChatMessageItem = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

type ChatMessagesProps = {
    messages: ChatMessageItem[];
};

export function ChatMessages({ messages }: ChatMessagesProps) {
    if (messages.length === 0) {
        return null;
    }

    return (
        <div
            style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
            }}
        >
            {messages.map((message) => (
                <div
                    key={message.id}
                    style={{
                        alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                        maxWidth: "70%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: message.role === "user" ? "#1f1f1f" : "#111",
                        border: "1px solid #2a2a2a",
                    }}
                >
                    <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{message.content}</p>
                </div>
            ))}
        </div>
    );
}