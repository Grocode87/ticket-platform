import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Cancelled = () => {
  const router = useRouter()

    return (
      <div>
      <Head>
        <title>Koachella 2022</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full min-h-screen bg-black text-white ">
        <div className="w-full lg:w-1/2 m-auto">
          <div className="w-full sm:w-8/12 pt-10">
            <Image src="/images/header-basic.png" width={800} height={180} />
          </div>
          <div className="pt-12 text-lg">
            <p className="font-semibold text-2xl pb-4">Payment Cancelled</p>
            <p className="pb-6">You have not been charged!</p>

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
    )
}

export default Cancelled;