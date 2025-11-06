import mammoth from "mammoth";
import * as XLSX from "xlsx";

// pdf-parse type definition
type PdfParseFunction = (buffer: Buffer) => Promise<{
  text: string;
  numpages: number;
}>;

// pdf-parse doesn't have proper ESM support, use require
const getPdfParse = async (): Promise<PdfParseFunction> => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("pdf-parse") as PdfParseFunction;
};

export interface ProcessedDocument {
  text: string;
  metadata: {
    pageCount?: number;
    wordCount: number;
    charCount: number;
  };
}

/**
 * Extract text dari PDF file
 */
async function extractTextFromPDF(buffer: Buffer): Promise<ProcessedDocument> {
  try {
    const pdf = await getPdfParse();
    const data = await pdf(buffer);
    
    return {
      text: data.text,
      metadata: {
        pageCount: data.numpages,
        wordCount: data.text.split(/\s+/).length,
        charCount: data.text.length,
      },
    };
  } catch (error) {
    console.error("Error extracting PDF:", error);
    throw new Error("Gagal extract text dari PDF");
  }
}

/**
 * Extract text dari DOCX file
 */
async function extractTextFromDOCX(buffer: Buffer): Promise<ProcessedDocument> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;
    
    return {
      text,
      metadata: {
        wordCount: text.split(/\s+/).length,
        charCount: text.length,
      },
    };
  } catch (error) {
    console.error("Error extracting DOCX:", error);
    throw new Error("Gagal extract text dari DOCX");
  }
}

/**
 * Extract text dari Excel file
 */
async function extractTextFromExcel(buffer: Buffer): Promise<ProcessedDocument> {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    let text = "";
    
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const sheetText = XLSX.utils.sheet_to_txt(worksheet);
      text += `\n=== Sheet: ${sheetName} ===\n${sheetText}\n`;
    });
    
    return {
      text,
      metadata: {
        wordCount: text.split(/\s+/).length,
        charCount: text.length,
      },
    };
  } catch (error) {
    console.error("Error extracting Excel:", error);
    throw new Error("Gagal extract text dari Excel");
  }
}

/**
 * Extract text dari plain text file
 */
async function extractTextFromPlainText(buffer: Buffer): Promise<ProcessedDocument> {
  try {
    const text = buffer.toString("utf-8");
    
    return {
      text,
      metadata: {
        wordCount: text.split(/\s+/).length,
        charCount: text.length,
      },
    };
  } catch (error) {
    console.error("Error extracting text:", error);
    throw new Error("Gagal extract text dari file");
  }
}

/**
 * Main function untuk extract text dari berbagai format file
 */
export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<ProcessedDocument> {
  try {
    // PDF
    if (mimeType === "application/pdf") {
      return await extractTextFromPDF(buffer);
    }
    
    // DOCX
    if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      return await extractTextFromDOCX(buffer);
    }
    
    // DOC (older format) - mammoth also supports this
    if (mimeType === "application/msword" || fileName.endsWith(".doc")) {
      return await extractTextFromDOCX(buffer);
    }
    
    // Excel
    if (
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType === "application/vnd.ms-excel" ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      return await extractTextFromExcel(buffer);
    }
    
    // CSV
    if (mimeType === "text/csv" || fileName.endsWith(".csv")) {
      return await extractTextFromPlainText(buffer);
    }
    
    // Plain text, markdown, etc
    if (
      mimeType.startsWith("text/") ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".md") ||
      fileName.endsWith(".markdown")
    ) {
      return await extractTextFromPlainText(buffer);
    }
    
    throw new Error(`Format file tidak didukung: ${mimeType}`);
  } catch (error) {
    console.error("Error processing document:", error);
    throw error;
  }
}

/**
 * Split text menjadi chunks untuk embedding
 * Menggunakan strategi overlap untuk konteks yang lebih baik
 */
export interface TextChunk {
  content: string;
  index: number;
  metadata: {
    startChar: number;
    endChar: number;
    wordCount: number;
  };
}

export function splitTextIntoChunks(
  text: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): TextChunk[] {
  const chunks: TextChunk[] = [];
  let startIndex = 0;
  let chunkIndex = 0;
  
  // Clean text: remove excessive whitespace and newlines
  const cleanText = text
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();
  
  if (cleanText.length === 0) {
    throw new Error("Dokumen kosong atau tidak bisa diproses");
  }
  
  while (startIndex < cleanText.length) {
    let endIndex = startIndex + chunkSize;
    
    // Jika ini bukan chunk terakhir, cari paragraph break atau sentence break terdekat
    if (endIndex < cleanText.length) {
      // Cari paragraph break (double newline)
      const paragraphBreak = cleanText.lastIndexOf("\n\n", endIndex);
      if (paragraphBreak > startIndex) {
        endIndex = paragraphBreak + 2;
      } else {
        // Cari sentence break (. ! ?)
        const sentenceBreak = Math.max(
          cleanText.lastIndexOf(". ", endIndex),
          cleanText.lastIndexOf("! ", endIndex),
          cleanText.lastIndexOf("? ", endIndex)
        );
        
        if (sentenceBreak > startIndex) {
          endIndex = sentenceBreak + 2;
        }
      }
    } else {
      endIndex = cleanText.length;
    }
    
    const chunkContent = cleanText.slice(startIndex, endIndex).trim();
    
    if (chunkContent.length > 0) {
      chunks.push({
        content: chunkContent,
        index: chunkIndex,
        metadata: {
          startChar: startIndex,
          endChar: endIndex,
          wordCount: chunkContent.split(/\s+/).length,
        },
      });
      chunkIndex++;
    }
    
    // Move to next chunk with overlap
    startIndex = endIndex - chunkOverlap;
    
    // Avoid infinite loop if chunk is too small
    if (startIndex >= cleanText.length - chunkOverlap) {
      break;
    }
  }
  
  return chunks;
}

