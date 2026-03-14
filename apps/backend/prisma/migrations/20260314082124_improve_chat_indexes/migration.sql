-- CreateIndex
CREATE INDEX "chat_messages_chatSessionId_createdAt_idx" ON "chat_messages"("chatSessionId", "createdAt");

-- CreateIndex
CREATE INDEX "chat_sessions_userId_updatedAt_idx" ON "chat_sessions"("userId", "updatedAt");
