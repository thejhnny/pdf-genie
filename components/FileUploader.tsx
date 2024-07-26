"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    CheckCircleIcon,
    CircleArrowDown,
    HammerIcon,
    RocketIcon,
    SaveIcon,
} from "lucide-react";

function FileUploader() {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        console.log(acceptedFiles);
    }, []);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isFocused,
        isDragAccept,
    } = useDropzone({
        onDrop,
    });
    return (
        <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
            <div
                {...getRootProps()}
                className={`p-10 border-2 border-dashed mt-10 w-[90%] text-[#6493BA] border-[#6493BA] rounded-lg h-96 flex items-center justify-center text-center ${
                    isFocused || isDragAccept ? "bg-[#9AB0B9]" : "bg-[#F5F7F8]"
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
                                Drag 'n' drop some files here, or click to
                                select files
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FileUploader;
