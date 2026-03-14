type ChatHeaderProps = {
    title?: string;
};

export function ChatHeader({ title = "New Chat" }: ChatHeaderProps) {
    return (
        <div
            style={{
                padding: "16px 20px",
                borderBottom: "1px solid #222",
            }}
        >
            <h1 style={{ margin: 0, fontSize: "20px" }}>{title}</h1>
        </div>
    );
}