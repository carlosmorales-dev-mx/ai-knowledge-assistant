import { env } from "@/lib/env";
import { getAccessToken } from "@/lib/storage";

export async function getDocumentsRequest() {
    const token = getAccessToken();

    const response = await fetch(`${env.apiUrl}/documents`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch documents");
    }

    return response.json();
}

export async function uploadDocumentRequest(file: File) {
    const token = getAccessToken();

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${env.apiUrl}/documents/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Upload failed");
    }

    return response.json();
}

export async function deleteDocumentRequest(documentId: string) {
    const token = getAccessToken();

    const response = await fetch(`${env.apiUrl}/documents/${documentId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete document");
    }

    return response.json();
}