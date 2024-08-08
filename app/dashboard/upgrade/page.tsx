"use client";

import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { createStripePortal } from "@/actions/createStripePortal";
import { Button } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";
import getStripe from "@/lib/stripe-js";
import { useUser } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type UserDetails = {
    email: string;
    name: string;
};

function PricingPage() {
    const { user } = useUser();
    const router = useRouter();
    const { hasActiveMembership, loading } = useSubscription();
    const [isPending, startTransition] = useTransition();

    const handleUpgrade = () => {
        if (!user) return;

        const userDetails: UserDetails = {
            email: user.primaryEmailAddress?.toString()!,
            name: user.fullName!,
        };

        startTransition(async () => {
            const stripe = await getStripe();

            if (hasActiveMembership) {
                // Create Stripe portal...
                const stripePortalUrl = await createStripePortal();
                return router.push(stripePortalUrl);
            }
            const sessionId = await createCheckoutSession(userDetails);

            await stripe?.redirectToCheckout({
                sessionId,
            });
        });
    };

    return (
        <div>
            <div className="py-24 sm:py-32 ">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-base font-semibold leading-7 text-[#6493BA]">
                        Pricing
                    </h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Power up your Genie
                    </p>
                </div>

                <p className="mx-auto mt-6 max-w-2xl px-10 text-center text-lg leading-8 text-gray-600">
                    Upgrade to PDF Genie Premium for exclusive features that
                    elevate your PDF experience. Enjoy faster uploads, unlimited
                    interactions, advanced search capabilities, and priority
                    support. Unlock the full potential of your PDFs and enhance
                    your productivity today!
                </p>
                <div className="max-w-md mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 md:max-w-2xl gap-8 lg:max-w-4xl">
                    {/* FREE */}
                    <div className="ring-1 ring-gray-200 p-8 h-fit pb-12 rounded-3xl">
                        <h3 className="text-lg font-semibold leading-8 text-gray-900">
                            Starter Plan
                        </h3>
                        <p className="mt-4 text-sm leading-6 text-gray-600">
                            Explore Core Features at No Cost
                        </p>
                        <p className="mt-6 flex items-baseline gap-x-1">
                            <span className="text-4xl font-bold tracking-tight text-gray-900">
                                Free
                            </span>
                        </p>

                        <ul
                            role="list"
                            className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                        >
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-[#6493BA]" />
                                2 Documents
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-[#6493BA]" />
                                Up to 3 messages per document
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-[#6493BA]" />
                                Try out the AI Chat Functionality
                            </li>
                        </ul>
                    </div>
                    {/* PRO */}
                    <div className="ring-2 ring-[#6493BA] p-8 rounded-3xl">
                        <h3 className="text-lg font-semibold leading-8 text-[#6493BA]">
                            Pro Plan
                        </h3>
                        <p className="mt-4 text-sm leading-6 text-gray-600">
                            Maximize Productivity with PRO Features
                        </p>
                        <p className="mt-6 flex items-baseline gap-x-1">
                            <span className="text-4xl font-bold tracking-tight text-gray-900">
                                $4.99
                            </span>
                            <span className="text-sm font-semibold leading-6 text-gray-600">
                                / month
                            </span>
                        </p>
                        <Button
                            className="bg-[#6493BA] w-full text-white shadow-sm hover:bg-[#7D9CBB] mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6493BA]"
                            disabled={loading || isPending}
                            onClick={handleUpgrade}
                        >
                            {isPending || loading
                                ? "Loading..."
                                : hasActiveMembership
                                ? "Manage Plan"
                                : "Upgrade To Pro"}
                        </Button>
                        <ul
                            role="list"
                            className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                        >
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-[#6493BA]" />
                                Store up to 20 documents
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-[#6493BA]" />
                                Ability to Delete Documents
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-[#6493BA]" />
                                Up to 100 messages per document
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-[#6493BA]" />
                                Full Power AI Chat Functionality with Memory
                                Recall
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-[#6493BA]" />
                                Advanced Analytics
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-[#6493BA]" />
                                24-hour support response time
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PricingPage;
