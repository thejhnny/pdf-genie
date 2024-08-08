"use client";

import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
    CheckCircleIcon,
    CircleArrowDown,
    HammerIcon,
    RocketIcon,
    SaveIcon,
} from "lucide-react";
import useUpload, { StatusText } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { useToast } from "./ui/use-toast";

function FileUploader() {
    const { progress, status, fileId, handleUpload } = useUpload();
    const { isOverFileLimit, filesLoading } = useSubscription();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (fileId) {
            router.push(`/dashboard/files/${fileId}`);
        }
    }, [fileId, router]);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                if (!isOverFileLimit && !filesLoading) {
                    await handleUpload(file);
                } else {
                    // TODO: ADD BUTTON TO TAKE THEM TO UPGRADE PAGE
                    toast({
                        variant: "destructive",
                        title: "Free Plan File Limit Reached",
                        description:
                            "You've reached the maximum number of files allowed for the Starter Plan. Please upgrade to add more documents.",
                    });
                }
            }
        },
        [handleUpload, isOverFileLimit, filesLoading, toast]
    );

    const statusIcons: {
        [key in StatusText]: JSX.Element;
    } = {
        [StatusText.UPLOADING]: (
            <RocketIcon className="h-20 w-20 text-[#6493BA]" />
        ),
        [StatusText.UPLOADED]: (
            <CheckCircleIcon className="h-20 w-20 text-[#6493BA]" />
        ),
        [StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-[#6493BA]" />,
        [StatusText.GENERATING]: (
            <HammerIcon className="h-20 w-20 text-[#6493BA]" />
        ),
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isFocused,
        isDragAccept,
    } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            "application/pdf": [".pdf"],
        },
    });

    const uploadInProgress =
        progress !== null && progress >= 0 && progress <= 100;

    return (
        <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
            {uploadInProgress && (
                <div className="mt-32 flex flex-col justify-center items-center gap-5">
                    <div
                        className={`radial-progress bg-[#9AB0B9] text-white border-[#6493BA] border-4 ${
                            progress === 100 && "hidden"
                        }`}
                        role="progressbar"
                        style={{
                            // TODO: FIX THIS
                            // @ts-ignore
                            "--value": progress,
                            "--size": "12rem",
                            "--thickness": "1.3rem",
                        }}
                    >
                        {progress} %
                    </div>

                    {
                        // TODO: FIX THIS
                        // @ts-ignore
                        statusIcons[status]
                    }

                    <p>{(status as string) || ""}</p>
                </div>
            )}

            {!uploadInProgress && (
                <div
                    {...getRootProps()}
                    className={`p-10 border-2 border-dashed mt-10 w-[90%] text-[#6493BA] border-[#6493BA] rounded-lg h-96 flex items-center justify-center text-center ${
                        isFocused || isDragAccept
                            ? "bg-[#9AB0B9]"
                            : "bg-[#F5F7F8]"
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center">
                        {isDragActive ? (
                            <>
                                <RocketIcon className="h-20 w-20 animate-ping" />
                                <p>Drop the files here ...</p>
                            </>
                        ) : (
                            <>
                                <CircleArrowDown className="h-20 w-20 animate-bounce" />
                                <p>
                                    Drag and drop some files here, or click to
                                    select files
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FileUploader;
