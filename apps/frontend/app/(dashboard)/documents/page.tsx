"use client";

import { useDocuments } from "@/features/documents/hooks/use-documents";
import { useUploadDocument } from "@/features/documents/hooks/use-upload-document";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";

export default function DocumentsPage() {
    const documentsQuery = useDocuments();
    const uploadMutation = useUploadDocument();

    function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        uploadMutation.mutate(file);
    }

    return (
        <div className="mx-auto max-w-6xl p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-ai-text">
                    Documents
                </h1>
                <p className="mt-2 text-sm text-ai-text-muted">
                    Upload and manage your PDF knowledge base.
                </p>
            </div>

            <Card className="mb-8 p-6">
                <div className="mb-4">
                    <h2 className="text-base font-semibold text-ai-text">Upload PDF</h2>
                    <p className="mt-1 text-sm text-ai-text-muted">
                        Add a document so the assistant can retrieve context from it.
                    </p>
                </div>

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleUpload}
                    className="block w-full rounded-2xl border border-ai-border bg-ai-surface-soft px-4 py-3 text-sm text-ai-text file:mr-4 file:rounded-xl file:border-0 file:bg-ai-dark file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-95"
                />

                {uploadMutation.isPending && (
                    <p className="mt-4 text-sm font-medium text-ai-primary">
                        Uploading document...
                    </p>
                )}

                {uploadMutation.isError && (
                    <p className="mt-4 text-sm font-medium text-ai-danger">
                        Failed to upload document.
                    </p>
                )}
            </Card>

            <div className="space-y-5">
                {documentsQuery.isLoading && (
                    <p className="text-sm text-ai-text-muted">Loading documents...</p>
                )}

                {documentsQuery.data?.data?.length === 0 && (
                    <Card className="border-dashed p-10 text-center">
                        <p className="text-base font-semibold text-ai-text">No documents yet</p>
                        <p className="mt-2 text-sm text-ai-text-muted">
                            Upload your first PDF to start asking questions with RAG.
                        </p>
                    </Card>
                )}

                {documentsQuery.data?.data?.map((doc: any) => (
                    <Card key={doc.id} className="p-6 transition hover:shadow-md">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                                <h2 className="truncate text-xl font-semibold text-ai-text">
                                    {doc.originalName}
                                </h2>
                                <p className="mt-1 truncate text-sm text-ai-text-muted">
                                    {doc.filename}
                                </p>
                            </div>

                            <StatusBadge status={doc.status} />
                        </div>

                        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                            <InfoItem label="Chunks" value={String(doc.chunkCount)} />
                            <InfoItem label="Type" value={doc.mimeType} />
                            <InfoItem label="Size" value={`${doc.fileSize} bytes`} />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <Panel className="px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ai-text-muted">
                {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-ai-text">{value}</p>
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