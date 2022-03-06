import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import TierListing from "../components/TierListing";
import styles from "../styles/Home.module.css";
import axios from 'axios';
import { CartDispatchContext, setAccessCode } from "../context/cart";

/**
 * FRONTEND TODO TMRW
 * - on home page, retrieve ticket info from db DONE
 * 
 * - when a buy now is pressed - add ticket and guestlist code to a global cart object DONE
 * 
 * - on checkout page - Add form validation for name and email DONE
 * - pass email, name, ticket priceID, and guestlist code to checkout session DONE
 * - when go to checkout is pressed - confirm that the ticket is still avaliable
 * 
 * - add payment success page
 * - add payment fail page
 * 
 * - properly send ticket to email
 * 
 * TO MAKE PRETTY
 * - home page
 * - make home page contain event details
 * - add nice header to checkout
 * - add powered by stripe to checkout
 * - Make checkout look a lil better
 * - add proper ticket preview to checkout - include ticket details
 * 
 * - finish ticket email
 * - contain event time and details
 * - thank you for purchase and stuff
 * 
 * - finish ticket pdf
 * - same as above, include some event info
 * - explain that it needs to be presented at the door
 * 
 * 
 */
export default function Home() {
  const [code, setCode] = useState("")
  const [validCode, setValidCode] = useState(false);
  const [codeMsg, setCodeMsg] = useState("");
  const [prices, setPrices] = useState([])

  const dispatch = useContext(CartDispatchContext);


  useEffect(() => {
    axios.get("/api/get_prices").then(res => {
      console.log(res.data.data)
      setPrices(res.data.data.sort((first, second) => {
        return (first.id > second.id) ? 1 : -1
      }))
    })
  }, [])



  const checkValidCode = () => {
    console.log("checking...")
    if(!code || code.length < 2) {
      return
    }
    axios.get("/api/check_code?code=" + code)
    .then(res => {
      console.log("checked")
      if(!res.data.valid) {
        setCodeMsg("Invalid code")
        console.log("invalid")
      } else {
        setCodeMsg("")
        setValidCode(res.data.valid)
        setAccessCode(dispatch, code)
      }
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex py-8">
          <div className="w-1/2 m-auto text-center">
            <div className="text-3xl font-bold pb-3">
              Kappa Sigma Presents
            </div>
            <div className="text-4xl font-bold text-purple-700 pb-10">
              KOACHELLA (WEBSITE WIP)
            </div>
           

            {!validCode && (
            <div className="my-16">
              <p className="text-2xl font-bold">Get your ticket</p>
              <p>
              
              </p>

              <div className="pt-4">
                <p className="pb-2 font-semibold">
                  Enter your Guestlist Code
                </p>
                <input
                  className="border-2 rounded-lg py-1 px-2"
                  type="text"
                  placeholder="abcd1234"
                  onInput={(e) => setCode(e.target.value)}
                />
                <button onClick={() => checkValidCode()} className="py-2 px-2 bg-blue-600 text-white rounded-lg ml-4">Submit</button>
                <div><p className="text-red-600">{codeMsg}</p></div>
              </div>
            </div>
            )}

            {validCode && (
              <>
                <div className="flex flex-col items-center pt-6">
                  {prices.map(price => {
                    return (
                      <TierListing key={price.id} data={price}/>
                    )
                  })}
                </div>
                <p>Transactions are made using Stripe - </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
