import axios from "axios";
import TierListing from "../components/TierListing";
import Image from 'next/image'

const Tickets = ({ code, prices }) => {
  return (
    <div className="w-full min-h-screen bg-black text-white">
      <div className="w-full md:w-1/2 m-auto pt-10">
        
        <div className="w-full sm:w-8/12 px-4 sm:px-0">
        <Image src="/images/header-basic.png" width={800} height={180} />
        </div>

        <p className="text-3xl font-bold pt-14 text-center sm:text-left">TICKETS</p>


        <div className="px-8 sm:px-0 mb-16">
          {prices.map((price) => {
            return <TierListing key={price.id} data={price} />;
          })}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  // check code validity

  let res = await axios.get(
    "https://koachellaubc.com/api/check_code?code=" + context.query.code
  );

  if (res.data?.valid) {
    res = await axios.get("https://koachellaubc.com/api/get_prices");
    console.log(res)
    const prices = res.data.data.sort((first, second) => {
      return first.id > second.id ? 1 : -1;
    });


    return {
      props: {
        code: context.query.code,
        prices: prices
      },
    };
  }

  

  return {
    redirect: {
      permanent: false,
      destination: "/",
    },
    props: {},
  };
}

export default Tickets;
