import { useRouter } from "next/router";
import { useContext } from "react";
import { CartDispatchContext, setCart } from "../context/cart";

const TierListing = ({data}) => {
  const router = useRouter();
  const dispatch = useContext(CartDispatchContext);
  const { name, price, price_id, active, sold_out } = data

  const redirectToCart = () => {
    const ticketData = { data };
    setCart(dispatch, ticketData);

    router.push("/cart")
  }

  return (
    <div className="w-full lg:w-1/2 border rounded-lg shadow-md p-4 my-2 flex justify-between items-center">
      <div className="pr-4 text-left">
        <p className="">Koachella</p>
        <p className="font-bold text-xl pb-3">{name} Ticket</p>
        {sold_out ? (
          <p className="text-red-600 font-bold">SOLD OUT</p>
        ) : (
          <p className="font-bold">${price / 100}</p>
        )}
      </div>
      <div className="whitespace-nowrap">
        {active ? (
          <button onClick={redirectToCart} className={"p-2 rounded-lg shadow-md bg-red-500 text-white "}>
            Buy Now
          </button>
        ) : (
          <button className={"p-2 rounded-lg shadow-md bg-gray-200 text-gray-400 "}>
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
};


export default TierListing;
