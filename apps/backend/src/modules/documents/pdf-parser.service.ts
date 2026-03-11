import { PDFParse } from "pdf-parse";
import { AppError } from "../../shared/errors/app-error.js";

export class PdfParserService {
    async parse(buffer: Buffer): Promise<string> {
        let parser: PDFParse | null = null;

        try {
            parser = new PDFParse({ data: buffer });

            const result = await parser.getText();
            const text = result.text?.trim();

            if (!text) {
                throw new AppError("PDF does not contain readable text", 400);
            }

            return text;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError("Failed to parse PDF", 500, {
                cause: error instanceof Error ? error.message : "unknown",
            });
        } finally {
            await parser?.destroy();
        }
    }
}

export const pdfParserService = new PdfParserService();