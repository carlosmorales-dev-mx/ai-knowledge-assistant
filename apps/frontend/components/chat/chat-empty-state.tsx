export function ChatEmptyState() {
    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
            }}
        >
            <div style={{ textAlign: "center", maxWidth: "520px" }}>
                <h2>Ask something about your documents</h2>
                <p style={{ color: "#999" }}>
                    This assistant uses RAG to search relevant chunks from your uploaded
                    PDFs and answer with contextual information.
                </p>
            </div>
        </div>
    );
}