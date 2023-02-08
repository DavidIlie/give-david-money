import type { NextPage } from "next";
import Head from "next/head";

import { fetchPostJSON } from "@/lib/api-helpers";
import getStripe from "@/lib/get-stripe";
import { formatAmountForDisplay } from "@/lib/stripe-helpers";
import { useState } from "react";
import * as config from "../lib/constants";

const Home: NextPage = () => {
   const [loading, setLoading] = useState(false);
   const [input, setInput] = useState({
      customDonation: 50,
   });

   const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
      setInput({
         customDonation: parseInt(e.currentTarget.value),
      });

   const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();
      setLoading(true);
      const response = await fetchPostJSON("/api/stripe/checkout", {
         amount: input.customDonation,
      });

      if (response.statusCode === 500) {
         console.error(response.message);
         return;
      }

      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
         sessionId: response.id,
      });
      console.warn(error.message);
      setLoading(false);
   };
   return (
      <>
         <Head>
            <title>Give David Money</title>
            <meta
               name="description"
               content="Pay David Money to support his adventures"
            />
         </Head>
         <div className="flex justify-center items-center min-h-screen">
            <div className="container max-w-3xl bg-gray-50 border border-gray-200 py-6 px-2 rounded-md">
               <form onSubmit={handleSubmit}>
                  <h1 className="font-medium text-xl mb-2 ml-1 text-gray-900">
                     Give David Money (
                     {formatAmountForDisplay(
                        config.MIN_AMOUNT,
                        config.CURRENCY
                     )}
                     -
                     {formatAmountForDisplay(
                        config.MAX_AMOUNT,
                        config.CURRENCY
                     )}
                     ):
                  </h1>
                  <input
                     type="number"
                     value={input.customDonation}
                     min={config.MIN_AMOUNT}
                     max={config.MAX_AMOUNT}
                     step={config.AMOUNT_STEP}
                     onChange={handleInputChange}
                     className="mb-2 w-full bg-white border border-gray-100 py-2 px-4 rounded-md"
                  />
                  <button
                     className={config.buttonStyle}
                     type="submit"
                     disabled={loading}
                  >
                     Donate{" "}
                     {formatAmountForDisplay(
                        input.customDonation,
                        config.CURRENCY
                     )}
                  </button>
               </form>
            </div>
         </div>
      </>
   );
};

export default Home;
