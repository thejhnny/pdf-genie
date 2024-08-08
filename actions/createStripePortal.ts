"use server";

import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { createCheckoutSession } from "./createCheckoutSession";
import stripe from "@/lib/stripe";
import getBaseUrl from "@/lib/getBaseUrl";

export async function createStripePortal() {
    auth().protect();

    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not found");
    }

    const user = await adminDb.collection("users").doc(userId).get();
    const stripeCustomerId = user.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
        throw new Error("Stripe customer not found");
    }

    const sessionId = await await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${getBaseUrl()}/dashboard`,
    });

    return sessionId.url;
}
