import type { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import { LoadingOverlay } from "@mantine/core";

import { fetchPostJSON } from "@/lib/api-helpers";
import getStripe from "@/lib/get-stripe";
import { formatAmountForDisplay } from "@/lib/stripe-helpers";
import * as config from "../lib/constants";

const Home: NextPage = () => {
   const [loading, setLoading] = useState(false);
   const [input, setInput] = useState(15);
   const [message, setMessaage] = useState("");

   const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
      setInput(parseInt(e.currentTarget.value));

   const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();
      setLoading(true);
      const response = await fetchPostJSON("/api/stripe/checkout", {
         amount: input,
         message: message,
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
         <LoadingOverlay visible={loading} />
         <div className="flex items-center justify-center min-h-screen">
            <div className="container max-w-3xl px-2 py-6 border border-gray-200 rounded-md bg-gray-50">
               <form onSubmit={handleSubmit}>
                  <h1 className="mb-2 ml-1 text-xl font-medium text-gray-900">
                     Give David Money
                  </h1>
                  <input
                     type="number"
                     value={input}
                     min={config.MIN_AMOUNT}
                     max={config.MAX_AMOUNT}
                     step={config.AMOUNT_STEP}
                     onChange={handleInputChange}
                     className={config.inputStyle}
                  />
                  <input
                     value={message}
                     onChange={(e) => setMessaage(e.target.value)}
                     className={config.inputStyle}
                     placeholder="Write message..."
                  />
                  <button
                     className={config.buttonStyle}
                     type="submit"
                     disabled={loading}
                  >
                     Donate {formatAmountForDisplay(input, config.CURRENCY)}
                  </button>
               </form>
            </div>
         </div>
      </>
   );
};

export default Home;
