"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";

// CORS Configuration
// gsutil cors set cors.json gs://pdf-genie-8e0f1.appspot.com
// go to >>> https://console.cloud.google.com/
// create new file in editor calls cors.json
// run >>> // gsutil cors set cors.json gs://pdf-genie-8e0f1.appspot.com
// https://firebase.google.com/docs/storage/web/download-files#cors_configuration

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfView({ url }: { url: string }) {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [file, setFile] = useState<Blob | null>(null);
    const [rotation, setRotation] = useState<number>(0);
    const [scale, setScale] = useState<number>(1);

    const onDocumentLoadSuccess = ({
        numPages,
    }: {
        numPages: number;
    }): void => {
        setNumPages(numPages);
    };

    useEffect(() => {
        const fetchFile = async () => {
            const response = await fetch(url);
            const file = await response.blob();
            setFile(file);
        };

        fetchFile();
    }, [url]);

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="sticky top-0 z-50 bg-gray-100 p-2 rounded-b-lg">
                <div className="max-w-6xl px-2 grid grid-cols-6 gap-2">
                    {/* Previous Button */}
                    <Button
                        variant="outline"
                        disabled={pageNumber === 1}
                        onClick={() => {
                            if (pageNumber > 1) {
                                setPageNumber(pageNumber - 1);
                            }
                        }}
                    >
                        Previous
                    </Button>
                    <p className="flex items-center justify-center">
                        {pageNumber} of {numPages}
                    </p>
                    {/* Next Button */}
                    <Button
                        variant="outline"
                        disabled={pageNumber === numPages}
                        onClick={() => {
                            if (numPages && pageNumber < numPages) {
                                setPageNumber(pageNumber + 1);
                            }
                        }}
                    >
                        Next
                    </Button>

                    {/* Rotate Clockwise Button */}
                    <Button
                        variant="outline"
                        onClick={() => {
                            setRotation((rotation + 90) % 360);
                        }}
                    >
                        <RotateCw />
                    </Button>

                    {/* Zoom In Button */}
                    <Button
                        variant="outline"
                        disabled={scale >= 1.5}
                        onClick={() => {
                            setScale(scale * 1.2);
                        }}
                    >
                        <ZoomInIcon />
                    </Button>

                    {/* Zoom Out Button */}
                    <Button
                        variant="outline"
                        disabled={scale <= 0.75}
                        onClick={() => {
                            setScale(scale / 1.2);
                        }}
                    >
                        <ZoomOutIcon />
                    </Button>
                </div>
            </div>
            {!file ? (
                <Loader2Icon className="animate-spin h-20 w-20 text-[#6493BA] mt-20" />
            ) : (
                <Document
                    loading={null}
                    file={file}
                    rotate={rotation}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="m-4 overflow-scroll"
                >
                    <Page
                        className="shadow-lg"
                        scale={scale}
                        pageNumber={pageNumber}
                    />
                </Document>
            )}
        </div>
    );
}

export default PdfView;
