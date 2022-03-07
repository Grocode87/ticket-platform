import Head from 'next/head';
import Image from 'next/image';

const Cancelled = () => {
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
            <p className="font-semibold text-2xl pb-4">Payment Cancelled</p>
            <p>You have not been charged!</p>

            <button className='p-2 rounded-lg bg-blue-400 text-white mt-10'>Return to Home</button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Cancelled;