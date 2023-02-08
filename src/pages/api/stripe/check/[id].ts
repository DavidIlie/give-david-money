import type { NextApiHandler } from "next";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
   //@ts-ignore
   apiVersion: "2020-08-27",
});

const handler: NextApiHandler = async (req, res) => {
   const id: string = req.query.id as string;
   try {
      if (!id.startsWith("cs_")) {
         throw Error("Incorrect CheckoutSession ID.");
      }
      const checkout_session: Stripe.Checkout.Session =
         await stripe.checkout.sessions.retrieve(id, {
            expand: ["payment_intent"],
         });

      res.status(200).json(checkout_session);
   } catch (err) {
      const errorMessage =
         err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
   }
};

export default handler;
