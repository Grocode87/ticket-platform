import Image from "next/image";

const Home = () => {
  return (
    <>
      <div className="object-cover w-full h-full fixed bg-black -z-50"></div>
      <video
        autoPlay
        muted
        loop
        className="object-cover w-full h-full absolute -z-10 bg-black"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>
      <div className="w-full min-h-scree">
        <div className="m-auto w-full lg:w-5/12 min-h-screen bg-black bg-opacity-50 text-white">
          {/** BASIC INFO*/}
          <div className="min-h-screen flex flex-col justify-between">
            {/** TOP */}
            <div className="text-3xl p-6 pt-20 sm:p-20">
              <Image src="/images/header.png" width={800} height={300} />
            </div>

            {/** BOTTOM */}
            <div className="text-center">
              <div className="pb-14">
                <p className="text-3xl font-bold pb-3">GET YOUR TICKET</p>
                <input
                  type="text"
                  className="bg-gray-200 rounded-xl p-2"
                  placeholder="Access Code"
                ></input>
                <div>
                  <button className="bg-purple-700 w-min px-4 py-2 text-2xl rounded-xl mt-3">
                    SUBMIT
                  </button>
                </div>
              </div>

              <div className="flex m-auto items-center text-center justify-center pb-8">
                <Image src="/images/arrow-down.png" width={30} height={20} />
                <p className="font-semibold text-xl pl-4">SEE EVENT DETAILS</p>
              </div>
            </div>
          </div>

          {/**BELOW FIRST PAGE DETAILS*/}
          <div className="px-8 py-8">
            <p className="text-2xl font-bold list">KOACHELLA 2022</p>
            <p className="pt-3">
              From the house that brought you @boslen , @felixcartal ,
              @ericreprid , @graysonrepp and @cotis1k28 to name a few, we are
              stoked to re-introduce the biggest and baddest music showcase
              after a 2 year hietus.
            </p>
            <p className="pt-6">
              The Brothers of Kappa Sigma officially present to you, KOACHΣLLA{" "}
            </p>
            <p className="pt-6">WHEN: Saturday, March 19th, 7:00-late</p>
            <p className="">
              WHERE: 2880 Westbrook Mall, First house on the left
            </p>
            <p className="pt-6">IMPORTANT</p>
            <ul className="list-disc pl-4">
              <li>
                DO NOT SHOW UP LATE - DOORS OPEN AT 7:00 and the event starts
                shortly after
              </li>
              <li>NO GLASS BOTTLES</li>
              <li>NO BACKPACKS/BAG</li>
            </ul>

            <p className="pt-8">
              FOLLOW @koachellaubc and @kappasigmaubc on instagram for up to
              date event info and updates
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
