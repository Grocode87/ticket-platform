import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useContext, useState } from "react";
import { CartStateContext } from "../context/cart";

const Cart = ({ query }) => {
  const { ticketData, accessCode } = useContext(CartStateContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [formValid, setFormValid] = useState(true);

  const checkFormValid = () => {
    if (
      firstName.length >= 2 &&
      lastName.length >= 2 &&
      email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setFormValid(true);
      return true;
    } else {
      setFormValid(false);
      return false;
    }
  };

  const redirectToCheckout = async () => {
    if (checkFormValid()) {
      const {
        data: { id },
      } = await axios.post(
        `/api/create_checkout_session`,
        {
          name: firstName + " " + lastName,
          email: email,
          priceId: ticketData.price_id,
          accessCode: accessCode,
          ticketName: "Koachella 2022 " + ticketData.name + " Ticket"
        }
      );

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
      await stripe.redirectToCheckout({ sessionId: id });
    }
  };

  return (
    <div className="flex py-8">
      <div className="w-1/2 m-auto">
        <p className="text-3xl font-bold">Checkout</p>

        <p className="pt-8 font-bold text-xl">Your Info</p> 
        <p className="pt-2 text-base">* Required</p>
        <div className="mt-4">
          <p className="pr-4 font-semibold pb-1">First Name*</p>
          <input
            type="text"
            className="text-base rounded-lg px-2 py-1 border-2"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <p className="pr-4 font-semibold pb-1">Last Name*</p>
          <input
            type="text"
            className="text-base rounded-lg px-2 py-1 border-2"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="mt-10">
          <p className="pr-4 font-semibold pb-1">Email*</p>
          <input
            type="text"
            className="text-base rounded-lg px-2 py-1 border-2"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-sm text-gray-500 pt-2">
            Ensure your email is correct - the ticket will be emailed to you
            shortly after purchase
          </p>
        </div>

        <p className="text-xl font-semibold pt-12 pb-2">Cart</p>
        <div className="flex flex-col">
          <div className="flex justify-between border-b pb-2">
            <p>Koachella 2022 {ticketData.name} Ticket x 1</p>
            <p className="font-bold">${ticketData.price / 100}</p>
          </div>
          <div className="flex justify-between border-b pb-2">
            <p>Tax</p>
            <p className="font-bold">$0.00</p>
          </div>
          <div className="flex justify-between pt-6 border-b pb-2">
            <p>Total</p>
            <p className="font-bold">${ticketData.price / 100}</p>
          </div>
        </div>
        {!formValid && (
          <p className="text-red-600 mt-10">
            Fill in all the required information
          </p>
        )}
        <button
          onClick={redirectToCheckout}
          className={"p-2 rounded-lg shadow-md bg-red-500 text-white mt-4"}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default Cart;
