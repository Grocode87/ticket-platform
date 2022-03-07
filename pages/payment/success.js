import Head from 'next/head';
import Image from 'next/image';

const Success = () => {
  return (
    <div>
      <Head>
        <title>Koachella 2022</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex">
        <div className="w-full lg:w-1/2 m-auto">
          <Image src="/images/banner.jpg" width="1000" height="400" />
          <div className="pt-8 text-lg">
            <p className="font-semibold text-2xl pb-4">Payment Succesful!</p>
            <p>Thank you for your purchase of a Koachella 2022 ticket</p>

            <p className="pb-6">
              A copy of your reciept will be sent to your email. Enjoy the
              event!
            </p>

            <p className="pb-6">
              If something went wrong in your purchase, contact
              colin.grob87@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
