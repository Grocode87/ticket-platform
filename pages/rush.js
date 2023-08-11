import React from "react";

const Timeline = () => {
  const events = [
    {
      date: "28th",
      month: "August",
      description: "Join the most diverse brotherhood...",
      imageUrl:
        "https://teamworkoutplatform.s3.us-west-2.amazonaws.com/event+1.jpg",
    },
    {
      date: "28th",
      month: "August",
      description: "Join the most diverse brotherhood...",
      imageUrl:
        "https://teamworkoutplatform.s3.us-west-2.amazonaws.com/event+1.jpg",
    },
    {
      date: "28th",
      month: "August",
      description: "Join the most diverse brotherhood...",
      imageUrl:
        "https://teamworkoutplatform.s3.us-west-2.amazonaws.com/event+1.jpg",
    },
    {
      date: "28th",
      month: "August",
      description: "Join the most diverse brotherhood...",
      imageUrl:
        "https://teamworkoutplatform.s3.us-west-2.amazonaws.com/event+1.jpg",
    },
    // Add more events here...
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto py-10 pt-80">
        <div className="flex flex-col items-center">
          <img
            src="https://teamworkoutplatform.s3.us-west-2.amazonaws.com/logo+ksig.png"
            width="396"
            height="170"
            alt="ksigLogo"
            className="mb-4"
          />
          <h1 className="text-4xl mb-2">CALENDAR</h1>
          <a
            href="https://www.instagram.com/kappasigmaubc/"
            target="_blank"
            rel="noreferrer noopener"
            className="text-blue-500 underline"
          >
            @kappasigmaubc
          </a>
        </div>
        <section className="relative mt-10">
          <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-white"></div>
          {events.map((event, index) => (
            <div
              className="flex flex-wrap justify-between mb-12 relative"
              key={index}
            >
              <div className="flex w-full justify-center">
                <div className="top-4 w-16 h-16 rounded-full bg-black border-2 border-yellow-500 flex items-center justify-center relative">
                  <p className="text-red-600 text-2xl font-semibold">
                    {event.date}
                  </p>
                  <p
                    className={
                      "absolute text-3xl text-red-600" +
                      (index % 2 == 0 ? " left-20" : " right-20")
                    }
                  >
                    {event.month}
                  </p>
                </div>
              </div>

              <div
                className={`w-1/2 p-4 ml-auto ${
                  index % 2 === 0 ? "ml-0 mr-auto pr-12" : "pl-12"
                }`}
              >
                <div className="relative"></div>
                <div className="bg-slate-800 text-white rounded-lg mt-6">
                  <img
                    src={event.imageUrl}
                    width="100%"
                    height="auto"
                    alt="whatever"
                    className="rounded-t-lg"
                  />
                  <p className="p-4">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Timeline;
