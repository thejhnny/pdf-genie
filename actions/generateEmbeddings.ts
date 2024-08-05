"use server";

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
    auth().protect();

    // turn pdf into embeddings [0.013223, 0.234234, ...]
    await generateEmbeddingsInPineconeVectorStore(docId);

    revalidatePath("/dashboard");

    return { completed: true };
}
