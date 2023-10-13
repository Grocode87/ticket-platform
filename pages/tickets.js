import axios from "axios";
import TierListing from "../components/TierListing";
import Image from "next/image";
import Head from "next/head";

const Tickets = ({ code, prices }) => {
  return (
    <div className="w-full min-h-screen bg-slate-900 text-white">
      <Head>
        <title>Fright at the Mansion 2023</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full md:w-1/2 m-auto pt-10">
        <p className="text-4xl font-bold pt-14 pb-4 text-center sm:text-left">
          FRIGHT AT THE MANSION 2023
        </p>
        <p className="text-3xl font-semibold text-center sm:text-left">
          TICKETS
        </p>

        <div className="px-8 sm:px-0 pb-16">
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

  let codeValid = await axios.get(
    "https://ksigubcevents.com/api/check_code?code=" + context.query.code
  );

  if (codeValid.data?.valid) {
    let res = await axios.get("https://ksigubcevents.com/api/get_prices");
    console.log(codeValid);
    let prices = res.data.data;

    prices = prices.sort((first, second) => {
      return first.id > second.id ? 1 : -1;
    });

    if (prices[0].name == "Exclusive Sorority") {
      const first = prices[0];
      prices = prices.slice(1);

      prices = prices.reverse();
      prices.unshift(first);
    } else {
      prices = prices.reverse();
    }

    prices = prices.filter((ticket) => {
      if (!codeValid.data?.sorority) {
        return !(ticket.name == "Exclusive Sorority");
      } else {
        return true;
      }
    });

    // add sorority name to sorority ticket
    if (codeValid.data?.sorority) {
      prices = prices.map((ticket) => {
        if (ticket.name == "Exclusive Sorority") {
          ticket = { ...ticket, sorority_name: codeValid.data?.sorority_name };
        }
        return ticket;
      });
    }

    return {
      props: {
        code: context.query.code,
        prices: prices,
        sorority: codeValid.data.sorority_name,
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
