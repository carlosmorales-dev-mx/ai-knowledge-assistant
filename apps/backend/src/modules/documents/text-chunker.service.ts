export type TextChunk = {
    index: number;
    content: string;
};

export class TextChunkerService {
    private readonly chunkSize = 500;
    private readonly overlap = 100;

    chunk(text: string): TextChunk[] {
        const chunks: TextChunk[] = [];

        let start = 0;
        let index = 0;

        while (start < text.length) {
            const end = start + this.chunkSize;
            const chunkText = text.slice(start, end).trim();

            if (chunkText.length > 0) {
                chunks.push({
                    index,
                    content: chunkText,
                });

                index++;
            }

            start += this.chunkSize - this.overlap;
        }

        return chunks;
    }
}

export const textChunkerService = new TextChunkerService();