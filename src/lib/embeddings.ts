import { OpenAIEmbeddings } from "@langchain/openai";

const openAIApiKey = process.env.OPENAI_API_KEY;

if (!openAIApiKey) {
  throw new Error("OPENAI_API_KEY tidak ditemukan di environment variables");
}

/**
 * Generate embeddings menggunakan OpenAI
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey,
      modelName: "text-embedding-3-small", // Model terbaru dan cost-effective
    });

    const vectors = await embeddings.embedDocuments(texts);
    return vectors;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Gagal generate embeddings dari OpenAI");
  }
}

/**
 * Generate single embedding untuk query
 */
export async function generateQueryEmbedding(text: string): Promise<number[]> {
  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey,
      modelName: "text-embedding-3-small",
    });

    const vector = await embeddings.embedQuery(text);
    return vector;
  } catch (error) {
    console.error("Error generating query embedding:", error);
    throw new Error("Gagal generate embedding untuk query");
  }
}

