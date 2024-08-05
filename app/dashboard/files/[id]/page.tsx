import Chat from "@/components/Chat";
import PdfView from "@/components/PdfView";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import React from "react";

async function ChatToFilePage({ params: { id } }: { params: { id: string } }) {
    auth().protect();
    const { userId } = await auth();

    const ref = await adminDb
        .collection("users")
        .doc(userId!)
        .collection("files")
        .doc(id)
        .get();

    const url = ref.data()?.downloadUrl;

    return (
        <div className="grid lg:grid-cols-5 h-full overflow-hidden">
            {/* Right Side*/}
            <div className="col-span-5 lg:col-span-2 overflow-y-auto">
                {/* Chat */}
                <Chat id={id} />
            </div>

            {/* Left Side*/}
            <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-[#6493BA] lg:-order-1 overflow-auto">
                {/* Pdf View */}
                <PdfView url={url} />
            </div>
        </div>
    );
}

export default ChatToFilePage;
