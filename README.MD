🧠 AI Knowledge Assistant (RAG System)

A full-stack AI-powered knowledge assistant that allows users to upload documents and query them using natural language through a Retrieval-Augmented Generation (RAG) pipeline.

Built with a production-oriented architecture, focusing on scalability, clean separation of concerns, and real-world AI system design.

🚀 Features
🔐 Authentication

JWT-based authentication

Register & Login flows

Protected routes

Persistent session handling

📄 Document Processing

Upload PDF documents

Automatic parsing

Intelligent text chunking

Embedding generation

Vector storage

🤖 AI Chat (RAG)

Session-based conversations

Context-aware follow-up questions

Retrieval pipeline:

Query embedding

Vector similarity search

Context packing

LLM response generation

Source attribution per response

💬 Chat System

Multiple chat sessions

Rename sessions

Delete sessions

Conversation memory

📁 Document Management

List documents

Delete documents

Processing status (READY, PROCESSING, FAILED)

🎨 UX Improvements

Toast notifications

Loading states

Disabled actions during mutations

Clean UI system (custom UI kit)

🧠 RAG Architecture
User Question
   ↓
Embedding Generation
   ↓
Vector Similarity Search
   ↓
Relevant Chunks Retrieval
   ↓
Context Packing
   ↓
LLM Prompt Construction
   ↓
Response Generation
   ↓
Answer + Sources
🏗️ Tech Stack
Backend

Node.js

TypeScript

Express

Prisma ORM

MySQL

JWT Authentication

Vector Store (Chroma / custom integration)

Google Gemini API

Frontend

Next.js (App Router)

React

TypeScript

TanStack Query

Zustand

TailwindCSS

📂 Project Structure
Backend
src/
  modules/
    auth/
    chat/
    documents/
  middlewares/
  lib/
  shared/
Frontend
app/
  (dashboard)/
  login/
  register/

features/
  auth/
  chat/
  documents/
  sessions/

components/
  ui/
  layout/
⚙️ Environment Variables
Backend
DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
GEMINI_MODEL=
Frontend
NEXT_PUBLIC_API_URL=
▶️ Running the Project
Backend
cd backend
npm install
npx prisma migrate dev
npm run dev
Frontend
cd frontend
npm install
npm run dev
🧩 Key Design Decisions
1. RAG Pipeline Separation

Embeddings, vector store, and LLM are decoupled services

Makes it easy to swap providers

2. Chat Memory Layer

Conversation history handled independently

Enables contextual follow-ups

3. Intelligent Retrieval Query

Detects follow-up questions

Expands query using previous user message

4. Context Packing Strategy

Filters by similarity threshold

Limits total token size

Orders by relevance

5. Defensive LLM Handling

Sanitization layer removes markdown artifacts

Fallback responses when LLM fails

6. Frontend Architecture

Feature-based structure

API layer separated from UI

Zustand for global state

React Query for server state

🧪 Possible Improvements

Streaming responses (real-time tokens)

Semantic re-ranking of chunks

Hybrid search (keyword + vector)

Multi-document querying

Role-based access (teams/workspaces)

Document previews

Better chunk visualization

Rate limiting & quotas

Caching layer for embeddings

📸 Screenshots

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)

🎥 Demo

(Optional) Add a short demo video or GIF

👨‍💻 Author

Carlos Morales — Full Stack Engineer

📌 Notes

This project was built to demonstrate:

Real-world AI system design

Retrieval-Augmented Generation (RAG)

Full-stack architecture skills

Scalable and maintainable code practices
