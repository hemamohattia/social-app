import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export const generatePDF = (data: { title: string; content: string }): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = new PassThrough();
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
        doc.pipe(stream);
        doc.fontSize(20).text(data.title, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(data.content);
        doc.end();
    });
};