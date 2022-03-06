import { useRouter } from "next/router";

const TierListing = ({ name, price, price_id, avaliable, soldout }) => {
  const router = useRouter();

  const redirectToCart = () => {
    router.push({pathname:'/cart', query:{name: name, price: price}}, "/cart")
  }

  return (
    <div className="w-1/2 border rounded-lg shadow-md p-4 my-2 flex justify-between items-center">
      <div className="pr-4">
        <div className="font-bold text-xl pb-3">{name}</div>
        <div>${price / 100}</div>
      </div>
      <div className="whitespace-nowrap">
        {avaliable ? (
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
