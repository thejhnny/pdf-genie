"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { askQuestion } from "@/actions/askQuestion";
import ChatMessage from "./ChatMessage";
import { useToast } from "./ui/use-toast";

export type Message = {
    id?: string;
    role: "human" | "ai" | "placeholder";
    message: string;
    createdAt: Date;
};
function Chat({ id }: { id: string }) {
    const { user } = useUser();
    const { toast } = useToast();

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isPending, startTransition] = useTransition();
    const bottomOfChatRef = useRef<HTMLDivElement>(null);

    const [snapshot, loading, error] = useCollection(
        user &&
            query(
                collection(db, "users", user?.id, "files", id, "chat"),
                orderBy("createdAt", "asc")
            )
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const q = input;

        setInput("");

        // Optimistic UI update
        setMessages((prev) => [
            ...prev,
            { role: "human", message: q, createdAt: new Date() },
            {
                role: "ai",
                message: "Thinking...",
                createdAt: new Date(),
            },
        ]);

        startTransition(async () => {
            const { success, message } = await askQuestion(id, q);

            if (!success) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: message,
                });

                setMessages((prev) =>
                    prev.slice(0, prev.length - 1).concat([
                        {
                            role: "ai",
                            message: `Woops... ${message}`,
                            createdAt: new Date(),
                        },
                    ])
                );
            }
        });
    };

    useEffect(() => {
        bottomOfChatRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    useEffect(() => {
        if (!snapshot) return;

        console.log("Updated snapshot", snapshot.docs);

        const lastMessage = messages.pop();

        if (
            lastMessage?.role === "ai" &&
            lastMessage.message === "Thinking..."
        ) {
            // return b/c this is the dummy placeholder message
            return;
        }

        const newMessages = snapshot.docs.map((doc) => {
            const { role, message, createdAt } = doc.data();
            return {
                id: doc.id,
                role,
                message,
                createdAt: createdAt.toDate(),
            };
        });
        setMessages(newMessages);
    }, [snapshot]);

    return (
        <div className="flex flex-col h-full overflow-scroll">
            {/* Chat Contents */}
            <div className="flex-1 w-full">
                {loading ? (
                    <div>
                        <Loader2Icon className="animate-spin h-20 w-20 text-[#6493BA] mt-20" />
                    </div>
                ) : (
                    <div className="p-5">
                        {messages.length === 0 && (
                            <ChatMessage
                                key={"placeholder"}
                                message={{
                                    role: "ai",
                                    message:
                                        "Ask me anything about the document!",
                                    createdAt: new Date(),
                                }}
                            />
                        )}

                        {messages.map((message, index) => (
                            <ChatMessage key={index} message={message} />
                        ))}
                        <div ref={bottomOfChatRef} />
                    </div>
                )}
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex sticky bottom-0 space-x-2 p-5 bg-[#6493BA]/75"
            >
                <Input
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                />
                <Button type="submit" disabled={!input || isPending}>
                    {isPending ? (
                        <Loader2Icon className="animate-spin text-[#6493BA]" />
                    ) : (
                        "Ask"
                    )}
                </Button>
            </form>
        </div>
    );
}

export default Chat;
