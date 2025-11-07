import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface OCRResult {
  text: string;
  confidence: number;
}

/**
 * Detect file MIME type from buffer
 * @param buffer - File buffer
 * @param mimeType - Provided MIME type (optional)
 * @returns MIME type string
 */
function detectFileMimeType(buffer: Buffer, mimeType?: string): string {
  // If mimeType provided, use it
  if (mimeType) {
    return mimeType;
  }

  // Check PNG signature
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }

  // Check JPEG signature
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // Check PDF signature (%PDF)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return "application/pdf";
  }

  // Default to image/png for images, application/octet-stream for others
  return "image/png";
}

/**
 * Extract text from any file using OpenAI Vision API
 * Supports: PDF, DOCX, images, and other document formats
 * @param buffer - File buffer
 * @param mimeType - File MIME type (optional)
 * @returns Extracted text and confidence score
 */
export async function extractTextFromImage(
  buffer: Buffer,
  mimeType?: string
): Promise<OCRResult> {
  try {
    // Convert buffer to base64
    const base64Data = buffer.toString("base64");
    const detectedMimeType = detectFileMimeType(buffer, mimeType);
    const dataUrl = `data:${detectedMimeType};base64,${base64Data}`;

    console.log(`Using OpenAI Vision API for text extraction (MIME: ${detectedMimeType})...`);

    // Determine prompt based on file type
    let prompt = "Extract all text from this document. Return only the text content, preserving structure and formatting. If there's no text, return an empty string.";
    
    if (detectedMimeType === "application/pdf") {
      prompt = "Extract all text from this PDF document. Return only the text content, preserving paragraphs and structure. Include all pages. If there's no text, return an empty string.";
    } else if (detectedMimeType.startsWith("image/")) {
      prompt = "Extract all text from this image. Return only the text content, nothing else. If there's no text, return an empty string.";
    } else if (
      detectedMimeType.includes("word") ||
      detectedMimeType.includes("document")
    ) {
      prompt = "Extract all text from this Word document. Return only the text content, preserving paragraphs and structure. If there's no text, return an empty string.";
    } else if (detectedMimeType.includes("excel") || detectedMimeType.includes("spreadsheet")) {
      prompt = "Extract all text from this Excel spreadsheet. Return the content in a readable format, preserving table structure. If there's no text, return an empty string.";
    }

    // Use OpenAI Vision API to extract text
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective vision model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 4096,
    });

    const extractedText = response.choices[0]?.message?.content || "";

    // Clean up whitespace
    const cleanedText = extractedText
      .replaceAll(/\n{3,}/g, "\n\n")
      .replaceAll(/\s{2,}/g, " ")
      .trim();

    console.log("Text extraction completed successfully, extracted", cleanedText.length, "characters");

    return {
      text: cleanedText,
      confidence: 95, // OpenAI Vision is very reliable
    };
  } catch (error) {
    console.error("Text extraction error:", error);
    throw new Error("Gagal extract text dari dokumen menggunakan OpenAI Vision API");
  }
}

/**
 * Check if file is an image that supports OCR
 * @param mimeType - File MIME type
 * @param fileName - File name
 * @returns true if file is PNG or JPG
 */
export function isOCRSupportedImage(
  mimeType: string,
  fileName: string
): boolean {
  const supportedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
  const supportedExtensions = [".png", ".jpg", ".jpeg"];

  return (
    supportedMimeTypes.includes(mimeType.toLowerCase()) ||
    supportedExtensions.some((ext) => fileName.toLowerCase().endsWith(ext))
  );
}
