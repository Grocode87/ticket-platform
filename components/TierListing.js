import { useRouter } from "next/router";
import { useContext } from "react";
import { CartDispatchContext, setCart } from "../context/cart";

const TierListing = ({ data }) => {
  const router = useRouter();
  const dispatch = useContext(CartDispatchContext);
  const { name, price, price_id, active, sold_out, sorority_name } = data;

  console.log(data);
  const redirectToCart = () => {
    const ticketData = { data };
    setCart(dispatch, ticketData);

    router.push("/cart");
  };

  return (
    <div className="w-full md:w-8/12 lg:w-1/2 border border-gray-700 rounded-lg shadow-md p-4 my-8 flex justify-between items-center bg-gray-900">
      <div className="pr-4 text-left">
        <p className="">Fright at the Mansion 2022</p>
        <p className="font-bold text-xl">{name} Ticket</p>
        {name == "Last Minute" && (
          <p className="text-orange-500">Available October 26th @12:00PM</p>
        )}
        {sorority_name && <p className="">{sorority_name}</p>}
        {sold_out ? (
          <div className="flex flex-row space-x-4">
            <p className="font-bold pt-3 line-through">
              ${parseInt(price) / 100}
            </p>
            <p className="text-red-600 font-bold pt-3">SOLD OUT</p>
          </div>
        ) : (
          <p className="font-bold pt-3">${parseInt(price) / 100}</p>
        )}
      </div>
      <div className="whitespace-nowrap">
        {active ? (
          <button
            onClick={redirectToCart}
            className={"p-2 rounded-lg shadow-md bg-orange-600 text-white "}
          >
            Buy Now
          </button>
        ) : (
          <button
            disabled
            className={"p-2 rounded-lg shadow-md bg-gray-200 text-gray-400 "}
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
};

export default TierListing;
