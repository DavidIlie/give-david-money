import type { NextApiHandler } from "next";

import { CURRENCY, MIN_AMOUNT, MAX_AMOUNT } from "../../../lib/constants";
import { formatAmountForStripe } from "../../../lib/stripe-helpers";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
   //@ts-ignore
   apiVersion: "2020-08-27",
});

const handler: NextApiHandler = async (req, res) => {
   if (req.method === "POST") {
      const amount: number = req.body.amount;
      try {
         if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
            throw new Error("Invalid amount.");
         }
         const params: Stripe.Checkout.SessionCreateParams = {
            submit_type: "donate",
            payment_method_types: ["card"],
            line_items: [
               {
                  //@ts-ignore
                  name: "Give David Money",
                  amount: formatAmountForStripe(amount, CURRENCY),
                  currency: CURRENCY,
                  quantity: 1,
               },
            ],
            success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/`,
         };
         const checkoutSession: Stripe.Checkout.Session =
            await stripe.checkout.sessions.create(params);

         res.status(200).json(checkoutSession);
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Internal server error";
         res.status(500).json({ statusCode: 500, message: errorMessage });
      }
   } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
   }
};

export default handler;
