"use client";

import { useDocuments } from "@/features/documents/hooks/use-documents";
import { useUploadDocument } from "@/features/documents/hooks/use-upload-document";
import { useDeleteDocument } from "@/features/documents/hooks/use-delete-document";
import { useToastStore } from "@/stores/toast.store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import type { Document } from "@/features/documents/types/document.types";

export default function DocumentsPage() {
    const documentsQuery = useDocuments();
    const uploadMutation = useUploadDocument();
    const deleteDocumentMutation = useDeleteDocument();
    const addToast = useToastStore((state) => state.addToast);

    function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        uploadMutation.mutate(file, {
            onSuccess: () => {
                addToast({
                    type: "success",
                    title: "Document uploaded",
                    description: `${file.name} was uploaded successfully`,
                });
                event.target.value = "";
            },
            onError: (error) => {
                const message =
                    error instanceof Error ? error.message : "Upload failed";

                addToast({
                    type: "error",
                    title: "Upload failed",
                    description: message,
                });
                event.target.value = "";
            },
        });
    }

    async function handleDeleteDocument(documentId: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this document?"
        );

        if (!confirmed) return;

        try {
            await deleteDocumentMutation.mutateAsync(documentId);

            addToast({
                type: "success",
                title: "Document deleted",
                description: "The document was removed from your knowledge base",
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to delete document";

            addToast({
                type: "error",
                title: "Delete failed",
                description: message,
            });
        }
    }

    const documents = documentsQuery.data?.data ?? [];

    return (
        <div className="h-full overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <div className="mb-3 inline-flex items-center rounded-full border border-white/70 bg-white/76 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-600 shadow-[0_8px_24px_rgba(99,102,241,0.08)] backdrop-blur-xl">
                        Knowledge base
                    </div>

                    <h1 className="text-4xl font-semibold tracking-[-0.05em] text-ai-text">
                        Documents
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-ai-text-muted">
                        Upload, organize, and manage the PDFs that power your RAG
                        workspace.
                    </p>
                </div>

                <Card className="mb-8 overflow-hidden p-0">
                    <div className="border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(99,102,241,0.05),rgba(255,255,255,0.45))] px-6 py-5">
                        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ai-text">
                            Upload PDF
                        </h2>
                        <p className="mt-1 text-sm text-ai-text-muted">
                            Add a document so the assistant can retrieve relevant context.
                        </p>
                    </div>

                    <div className="p-6">
                        <label className="block">
                            <span className="mb-3 block text-sm font-medium text-ai-text">
                                Choose a PDF file
                            </span>

                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleUpload}
                                disabled={uploadMutation.isPending}
                                className="block w-full rounded-[24px] border border-white/70 bg-white/72 px-4 py-4 text-sm text-ai-text shadow-[0_10px_30px_rgba(15,23,42,0.04)] file:mr-4 file:rounded-[16px] file:border-0 file:bg-[linear-gradient(135deg,#6366f1,#7c3aed)] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:file:opacity-95"
                            />
                        </label>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-white/70 bg-white/76 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ai-text-muted">
                                PDF only
                            </span>
                            <span className="rounded-full border border-white/70 bg-white/76 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ai-text-muted">
                                Retrieval-ready
                            </span>
                            <span className="rounded-full border border-white/70 bg-white/76 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ai-text-muted">
                                Production flow
                            </span>
                        </div>

                        {uploadMutation.isPending && (
                            <div className="mt-5 inline-flex items-center gap-3 rounded-[18px] border border-white/70 bg-white/76 px-4 py-3 text-sm text-ai-text-muted shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-ai-primary" />
                                Uploading document...
                            </div>
                        )}
                    </div>
                </Card>

                <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ai-text">
                            Uploaded documents
                        </h2>
                        <p className="mt-1 text-sm text-ai-text-muted">
                            {documents.length} document{documents.length === 1 ? "" : "s"} in
                            your workspace
                        </p>
                    </div>
                </div>

                {documentsQuery.isLoading ? (
                    <div className="grid gap-4">
                        <DocumentSkeleton />
                        <DocumentSkeleton />
                        <DocumentSkeleton />
                    </div>
                ) : documents.length === 0 ? (
                    <Card className="border-dashed px-8 py-14 text-center">
                        <div className="mx-auto max-w-xl">
                            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/70 bg-white/76 text-sm font-semibold tracking-[0.14em] text-indigo-600 shadow-[0_12px_30px_rgba(99,102,241,0.10)]">
                                PDF
                            </div>
                            <p className="text-lg font-semibold text-ai-text">
                                No documents yet
                            </p>
                            <p className="mt-3 text-sm leading-7 text-ai-text-muted">
                                Upload your first PDF to start asking grounded questions with
                                RAG.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {documents.map((doc: Document) => {
                            const isDeleting =
                                deleteDocumentMutation.isPending &&
                                deleteDocumentMutation.variables === doc.id;

                            return (
                                <Card
                                    key={doc.id}
                                    className="p-6 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_20px_55px_rgba(99,102,241,0.10)]"
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0">
                                            <div className="mb-3 flex flex-wrap items-center gap-3">
                                                <StatusBadge status={doc.status} />
                                            </div>

                                            <h3 className="truncate text-xl font-semibold tracking-[-0.02em] text-ai-text">
                                                {doc.originalName}
                                            </h3>

                                            <p className="mt-1 truncate text-sm text-ai-text-muted">
                                                {doc.filename}
                                            </p>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="secondary"
                                            disabled={isDeleting}
                                            onClick={() => handleDeleteDocument(doc.id)}
                                            className="h-11 border-rose-200/70 text-rose-700 hover:bg-rose-50/80 hover:text-rose-700"
                                        >
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </Button>
                                    </div>

                                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                        <InfoItem
                                            label="Chunks"
                                            value={String(doc.chunkCount)}
                                        />
                                        <InfoItem label="Type" value={doc.mimeType} />
                                        <InfoItem
                                            label="Size"
                                            value={formatFileSize(doc.fileSize)}
                                        />
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <Panel className="px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai-text-muted">
                {label}
            </p>
            <p className="mt-2 text-sm font-semibold text-ai-text">{value}</p>
        </Panel>
    );
}

function StatusBadge({ status }: { status: string }) {
    const tone =
        status === "READY"
            ? "success"
            : status === "PROCESSING"
                ? "warning"
                : status === "FAILED"
                    ? "danger"
                    : "primary";

    return <Badge tone={tone}>{status}</Badge>;
}

function DocumentSkeleton() {
    return (
        <Card className="animate-pulse p-6">
            <div className="flex flex-col gap-5">
                <div className="h-5 w-32 rounded-full bg-ai-surface-soft" />
                <div className="h-6 w-1/2 rounded-full bg-ai-surface-soft" />
                <div className="h-4 w-1/3 rounded-full bg-ai-surface-soft" />
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="h-20 rounded-[20px] bg-ai-surface-soft" />
                    <div className="h-20 rounded-[20px] bg-ai-surface-soft" />
                    <div className="h-20 rounded-[20px] bg-ai-surface-soft" />
                </div>
            </div>
        </Card>
    );
}

function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}