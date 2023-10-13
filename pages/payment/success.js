import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

const Success = () => {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Fright at the Mansion 2023</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full min-h-screen bg-black text-white ">
        <div className="w-full lg:w-1/2 m-auto px-6 lg:px-0">
          <div className="w-full sm:w-6/12 pt-10">
            <Image
              src="/images/header_flat_basic.png"
              width={800}
              height={250}
            />
          </div>
          <div className="pt-12 text-lg">
            <p className="font-semibold text-2xl pb-4">Payment Succesful!</p>
            <p className="pb-6">
              Thank you for your purchase of a Fright at the Mansion 2023 ticket
            </p>

            <p className="pb-20">
              Your reciept and ticket will be sent to your email in the next few
              minutes. Enjoy the event!
            </p>

            <p className="pb-6">
              If something went wrong in your purchase, contact
              ee.kappasigma@gmail.com
            </p>

            <button
              onClick={() => router.push("/")}
              className={
                "p-2 rounded-lg shadow-md bg-purple-700 text-white mt-8"
              }
            >
              Return To Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
