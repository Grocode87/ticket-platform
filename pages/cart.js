import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useContext, useState } from "react";
import { CartStateContext } from "../context/cart";
import Image from "next/image";
import Head from "next/head";

const Cart = ({ query }) => {
  const { ticketData, accessCode } = useContext(CartStateContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [sororityCheck, setSororityCheck] = useState(false);

  const [formValid, setFormValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState(true);
  const [loading, setLoading] = useState(false);

  const checkFormValid = () => {
    if (firstName < 2) {
      setFormValid(false);
      setErrorMsg("First name must be at least 2 charactors");
      return false;
    } else if (lastName.length < 2) {
      setFormValid(false);
      setErrorMsg("Last name must be at least 2 charactors");
      return false;
    } else if (
      !email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setFormValid(false);
      setErrorMsg("Enter a valid email address");
      return false;
    } else if (ticketData.name == "Exclusive Sorority" && !sororityCheck) {
      setFormValid(false);
      setErrorMsg("Please check the checkbox to continue");
      return false;
    } else {
      setFormValid(true);
      setErrorMsg("");
      return true;
    }
  };

  const redirectToCheckout = async () => {
    // CHECK TO MAKE SURE ACCESS CODE IS STILL VALID + TICKET IS AVALIABLE
    setLoading(true);
    let codeValid = await axios.get("/api/check_code?code=" + accessCode);

    let stillValid = true;
    if (codeValid.data?.valid) {
      console.log("code valid");
      let res = await axios.get("/api/get_prices");
      let prices = res.data.data;
      console.log(prices);
      await prices.forEach((price) => {
        if (price.name == ticketData.name) {
          if (!price.active) {
            setErrorMsg("The ticket in your cart is no longer avaliable");
            stillValid = false;
          }
        }
      });
    } else {
      setErrorMsg("Invalid access code");
      stillValid = false;
    }

    if (stillValid && checkFormValid()) {
      const {
        data: { id },
      } = await axios.post(`/api/create_checkout_session`, {
        name: firstName + " " + lastName,
        email: email,
        priceId: ticketData.price_id,
        accessCode: accessCode,
        ticketName: "Fright at The Mansion 2022 " + ticketData.name + " Ticket",
      });

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
      await stripe.redirectToCheckout({ sessionId: id });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="flex py-8 bg-slate-900 text-white">
      <Head>
        <title>Fright at the Mansion 2022</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full px-8 m-auto md:w-1/2 md:px-0">
        <div className="w-full sm:w-8/12">
          <Image
            src="/images/header_flat_basic.png"
            priority
            width={800}
            height={250}
          />
        </div>
        <p className="text-3xl font-bold pt-8">Checkout</p>

        <p className="pt-8 font-bold text-xl">Your Info</p>
        <p className="pt-2 text-base">* Required</p>
        <div className="mt-4">
          <p className="pr-4 font-semibold pb-1">First Name*</p>
          <input
            type="text"
            className="text-base rounded-lg px-2 py-1 border-2 text-black bg-gray-300 border-gray-500"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <p className="pr-4 font-semibold pb-1">Last Name*</p>
          <input
            type="text"
            className="text-base rounded-lg px-2 py-1 border-2 text-black bg-gray-300 border-gray-500"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="mt-10">
          <p className="pr-4 font-semibold pb-1">Email*</p>
          <input
            type="text"
            className="text-base rounded-lg px-2 py-1 border-2 text-black bg-gray-300 border-gray-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-sm text-gray-300 pt-2">
            Ensure your email is correct - the ticket will be emailed to you
            shortly after purchase
          </p>
        </div>

        <p className="text-xl font-semibold pt-12 pb-2">Cart</p>
        <div className="flex flex-col">
          <div className="flex justify-between border-b pb-2">
            <p>Fright at the Mansion 2022 {ticketData.name} Ticket x 1</p>
            <p className="font-bold">${ticketData.price / 100}</p>
          </div>
          <div className="flex justify-between border-b pb-2 pt-2">
            <p>Tax/Fees</p>
            <p className="font-bold">$1.44</p>
          </div>
          <div className="flex justify-between pt-6 border-b pb-2">
            <p>Total</p>
            <p className="font-bold">
              ${(parseInt(ticketData.price) + 145) / 100}
            </p>
          </div>
        </div>
        {ticketData.name == "Exclusive Sorority" && (
          <div className="flex flex-row space-x-3  pt-8">
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                id="sorority"
                name="sorority"
                value={sororityCheck}
                onChange={(e) => setSororityCheck(e.target.checked)}
              ></input>
            </div>
            <p>
              I understand that I am purchasing a sorority only ticket, and I
              understand that this ticket will be revoked with no refund if I am
              not in a sorority
            </p>
          </div>
        )}
        {errorMsg && <p className="text-red-600 mt-10">{errorMsg}</p>}
        <button
          onClick={redirectToCheckout}
          className={"p-2 rounded-lg shadow-md bg-orange-500 text-white mt-8"}
        >
          {!loading ? "Continue to Payment" : "Loading..."}
        </button>
        <div className="pt-2">
          <a href="https://stripe.com">
            <Image
              src="/images/powered-by-stripe.svg"
              width={120}
              height={60}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Cart;
