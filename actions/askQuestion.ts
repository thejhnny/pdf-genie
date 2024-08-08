"use server";

import { Message } from "@/components/Chat";
import { FREE_LIMIT, PRO_LIMIT } from "@/data/constants";
import { adminDb } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";

export async function askQuestion(id: string, question: string) {
    auth().protect();
    const { userId } = await auth();

    const chatRef = adminDb
        .collection("users")
        .doc(userId!)
        .collection("files")
        .doc(id)
        .collection("chat");

    // Check number of user messages in the chat
    const chatSnapshot = await chatRef.get();
    const userMessages = chatSnapshot.docs.filter(
        (doc) => doc.data().role === "human"
    );

    const userRef = await adminDb.collection("users").doc(userId!).get();

    // TODO: Limit the PRO/FREE users
    if (!userRef.data()?.hasActiveMembership) {
        if (userMessages.length > FREE_LIMIT) {
            return {
                success: false,
                message: `You'll need to upgrade to PRO to ask more than ${FREE_LIMIT} questions per document 😔`,
            };
        }
    }

    if (userRef.data()?.hasActiveMembership) {
        if (userMessages.length > PRO_LIMIT) {
            return {
                success: false,
                message: `You've reached the PRO limit of ${PRO_LIMIT} questions per document 😔`,
            };
        }
    }

    const userMessage: Message = {
        role: "human",
        message: question,
        createdAt: new Date(),
    };

    await chatRef.add(userMessage);

    // Generate AI Response
    const reply = await generateLangchainCompletion(id, question);

    const aiMessage: Message = {
        role: "ai",
        message: reply,
        createdAt: new Date(),
    };

    await chatRef.add(aiMessage);

    return { success: true, message: null };
}
