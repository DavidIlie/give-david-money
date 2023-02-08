import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";

import * as config from "../lib/constants";
import { fetchGetJSON } from "@/lib/api-helpers";

const ResultPage: NextPage = () => {
   const router = useRouter();
   const { data, error } = useSWR(
      router.query.session_id ? `/api/stripe/${router.query.session_id}` : null,
      fetchGetJSON
   );

   if (error) return <div>failed to load</div>;

   console.log(data);

   return (
      <>
         <Head>
            <title>Yay Money</title>
         </Head>
         <div className="flex justify-center items-center min-h-screen">
            <div className="container max-w-3xl bg-gray-50 border border-gray-200 py-6 px-2 rounded-md">
               <h1 className="text-center font-medium text-xl text-gray-900 mb-2">
                  Thank you{" "}
                  {data && <>for paying {data?.customer_details.name}!</>}
               </h1>
               <p className="text-gray-600">
                  You have been emailed information about your payment. Status:{" "}
                  {data?.payment_intent?.status}
               </p>
               <div className="mt-3" />
               <button
                  className={config.buttonStyle}
                  onClick={() => router.push("/")}
               >
                  Pay Again
               </button>
            </div>
         </div>
      </>
   );
};

export default ResultPage;
