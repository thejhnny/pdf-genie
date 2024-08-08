"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import { useTransition } from "react";
import useSubscription from "@/hooks/useSubscription";
import { Button } from "./ui/button";
import Link from "next/link";
import { DownloadCloud, Trash2Icon } from "lucide-react";
import { deleteDocument } from "@/actions/deleteDocument";

function Document({
    id,
    name,
    size,
    downloadUrl,
}: {
    id: string;
    name: string;
    size: number;
    downloadUrl: string;
}) {
    const router = useRouter();
    const [isDeleting, startTransition] = useTransition();
    const { hasActiveMembership } = useSubscription();

    return (
        <div className="flex flex-col w-64 h-80 rounded-xl bg-white drop-shadow-md justify-between p-4 transition-all transform hover:scale-105 hover:bg-[#6493BA] hover:text-white cursor-pointer group">
            <div>
                <div
                    className="flex-1"
                    onClick={() => {
                        router.push(`/dashboard/files/${id}`);
                    }}
                >
                    <p className="font-semibold line-clamp-2">{name}</p>
                    <p>{byteSize(size).value} KB</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 justify-end">
                <Button
                    variant="outline"
                    disabled={isDeleting || !hasActiveMembership}
                    onClick={() => {
                        const prompt = window.confirm(
                            "Are you sure you want to delete this document?"
                        );
                        if (prompt) {
                            startTransition(async () => {
                                await deleteDocument(id);
                            });
                        }
                    }}
                >
                    <Trash2Icon className="h-6 w-6 text-red-500" />
                    {!hasActiveMembership && (
                        <span className="text-red-500 ml-2">PRO Feature</span>
                    )}
                </Button>

                <Button variant="outline" asChild>
                    <Link href={downloadUrl} download>
                        <DownloadCloud className="h-6 w-6 text-[#6493BA]" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default Document;
