import axios from "axios";
import TierListing from "../components/TierListing";
import Image from "next/image";
import Head from "next/head";

const Tickets = ({ code, prices }) => {
  return (
    <div className="w-full min-h-screen bg-slate-900 text-white">
      <Head>
        <title>Fright at the Mansion 2022</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full md:w-1/2 m-auto pt-10">
        <div className="w-full sm:w-8/12 px-4 sm:px-0">
          <Image
            priority
            src="/images/header_flat_basic.png"
            width={800}
            height={250}
          />
        </div>

        <p className="text-3xl font-bold pt-14 text-center sm:text-left">
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

    prices = prices.sort((first, second) => {
      return first.id > second.id ? 1 : -1;
    });

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
