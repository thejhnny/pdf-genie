"use server";

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { adminDb } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createCheckoutSession(userDetails: UserDetails) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("No user found");
    }

    let stripeCustomerId;

    const user = await adminDb.collection("users").doc(userId).get();
    stripeCustomerId = user.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
        // Create new stripe customer
        const customer = await stripe.customers.create({
            email: userDetails.email,
            name: userDetails.name,
            metadata: {
                userId,
            },
        });

        await adminDb.collection("users").doc(userId).set({
            stripeCustomerId: customer.id,
        });

        stripeCustomerId = customer.id;
    }
    console.log("URL HERE ", getBaseUrl);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price: "price_1PlILxKEbl5bd9Rxql1sAKWQ",
                quantity: 1,
            },
        ],
        mode: "subscription",
        customer: stripeCustomerId,
        success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
        cancel_url: `${getBaseUrl()}/upgrade`,
    });

    return session.id;
}
