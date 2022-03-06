import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const Cart = ({ query }) => {
  const redirectToCheckout = async () => {
    const {
      data: { id },
    } = await axios.post("/api/create_checkout_session");

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
    await stripe.redirectToCheckout({ sessionId: id });
  };

  return (
    <div className="flex py-8">
      <div className="w-1/2 m-auto">
        <p className="text-2xl font-bold">Checkout</p>


        <p className="pt-8 font-semibold text-xl">Your Info</p>
        <div className="flex items-center mt-4">
          <p className="pr-4 w-28">First Name</p>
          <input
            type="text"
            className="text-base rounded-lg px-2 py-1 border-2"
          />
        </div>

        <div className="flex items-center mt-4">
          <p className="pr-4 w-28">Last Name</p>
          <input
            type="text"
            className="text-base rounded-lg px-2 py-1 border-2 "
          />
        </div>

        <div className="mt-16">
          <div className="flex items-center">
            <p className="pr-4 w-28">Email</p>
            <input
              type="text"
              className="text-base rounded-lg px-2 py-1 border-2"
            />
          </div>
          <p className="text-sm text-gray-500 pt-2">
            Ensure your email is correct - the ticket will be emailed to you
            shortly after purchase
          </p>
        </div>


        <p className="text-xl font-semibold pt-12 pb-2">Cart</p>
        <div className="flex flex-col">
            <div className="flex justify-between border-b pb-2">
                <p>Koachella 2022 {query.name} Ticket x 1</p>
                <p>${query.price / 100}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
                <p>Tax</p>
                <p>$0.00</p>
            </div>
            <div className="flex justify-between pt-6 border-b pb-2">
                <p>Total</p>
                <p>${query.price / 100}</p>
            </div>
        </div>

      

        <button
          onClick={redirectToCheckout}
          className={"p-2 rounded-lg shadow-md bg-red-500 text-white mt-14"}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

Cart.getInitialProps = async ({ query }) => {
  console.log(query);
  return { query };
};

export default Cart;
