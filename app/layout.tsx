import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
    title: "PDF Genie",
    description: "App to answer questions about a PDF file",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="min-h-screen h-screen overflow-hidden flex flex-col">
                    <Toaster />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
