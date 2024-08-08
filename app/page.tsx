import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import features from "@/data/features";

export default function Home() {
    return (
        <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-[#375673]">
            <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
                <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-[#6493BA]">
                            Your Interactive PDF Genie
                        </h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl text-center">
                            Interact with our genie to learn more about your PDFs
                        </p>
                        <p className="mt-6 text-lg leading 8 text-gray-600">
                            Introducing{" "}
                            <span className="text-[#6493BA]">PDF Genie</span>.
                        </p>
                        <p className="mt-6 text-lg leading 8 text-gray-600">
                            Upload your document and our{" "}
                            <span className="text-[#6493BA]">PDF Genie</span>{" "}
                            will answer any questions you have about it. Saving
                            you time and increase productivity!
                        </p>
                    </div>
                    <Button asChild className="mt-8">
                        <Link href="/dashboard">Get Started</Link>
                    </Button>
                </div>

                <div className="relative overflow-hidden pt-12">
                    <div className="mx-auto max-w-7xl px-6 lg:px-12">
                        <Image
                            alt="PDF Screenshot"
                            src="/images/demo.png"
                            width={2432}
                            height={1442}
                            className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
                        />
                        <div aria-hidden="true" className="relative">
                            <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-white/95 pt-[5%]" />
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
                    <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-5 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg-mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
                        {features.map((feature, index) => (
                            <div key={index} className="relative pl-8">
                                <dt className="inline font-semibold text-gray-900">
                                    <feature.icon
                                        aria-hidden="true"
                                        className="absolute left-1 top-1 h-5 w-5 text-[#6493BA]"
                                    />
                                </dt>

                                <dd>{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </main>
    );
}
