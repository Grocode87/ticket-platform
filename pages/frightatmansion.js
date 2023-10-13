import Image from "next/image";
import Head from "next/head";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { CartDispatchContext, setAccessCode } from "../context/cart";
import { useRouter } from "next/router";

/**
 * FRONTEND TODO TMRW
 * - on home page, retrieve ticket info from db DONE
 *
 * - when a buy now is pressed - add ticket and guestlist code to a global cart object DONE
 *
 * - on checkout page - Add form validation for name and email DONE
 * - pass email, name, ticket priceID, and guestlist code to checkout session DONE
 * - when go to checkout is pressed - confirm that the ticket is still avaliable
 *
 * - add payment success page
 * - add payment fail page
 *
 * - properly send ticket to email
 *
 * TO MAKE PRETTY
 * - home page
 * - make home page contain event details
 * - add nice header to checkout
 * - add powered by stripe to checkout
 * - Make checkout look a lil better
 * - add proper ticket preview to checkout - include ticket details
 *
 * - finish ticket email
 * - contain event time and details
 * - thank you for purchase and stuff
 *
 * - finish ticket pdf
 * - same as above, include some event info
 * - explain that it needs to be presented at the door
 *
 *
 */

const FrightAtMansion = () => {
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState("");
  const [onMobile, setOnMobile] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useContext(CartDispatchContext);

  const router = useRouter();

  const bottom = useRef(null);

  const handleAccessCodeChange = (e) => {
    setCode(e.target.value);
  };

  const checkValidCode = () => {
    console.log("checking...");
    setLoading(true);
    if (!code || code.length < 2) {
      setCodeMsg("Invalid code");
      setLoading(false);
      return;
    }
    axios.get("/api/check_code?code=" + code).then((res) => {
      console.log("checked");
      if (!res.data.valid) {
        setCodeMsg("Invalid code");
        setLoading(false);
      } else {
        setCodeMsg("");
        setAccessCode(dispatch, code);
        router.push({ pathname: "/tickets", query: { code: code } });
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    window.mobileCheck = function () {
      let check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    };

    setOnMobile(window.mobileCheck());
  }, []);

  return (
    <>
      <Head>
        <title>Fright at the Mansion</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="object-cover w-full h-full fixed bg-slate-900 -z-50"></div>
      <img
        src="/videos/scarybg.gif"
        className="object-cover w-full h-full absolute -z-10 bg-black blur-md"
      />

      <div className="w-full min-h-screen">
        <div className="m-auto w-full lg:w-5/12 min-h-screen max-h-screen bg-black bg-opacity-50 text-white">
          {/** BASIC INFO*/}
          <div className="min-h-screen flex flex-col justify-between">
            {/** TOP */}
            <div className="text-3xl p-4 pt-20 sm:px-20">
              <Image
                priority
                src="/images/header_main.png"
                width={700}
                height={600}
              />
            </div>

            {/** BOTTOM */}
            <div className="text-center">
              <div className="pb-14">
                <p className="text-2xl font-bold pb-3">GET ON THE GUESTLIST</p>

                <input
                  type="text"
                  className="bg-gray-200 rounded-xl p-2 text-black text-center w-64"
                  placeholder="ENTER YOUR ACCESS CODE"
                  onChange={handleAccessCodeChange}
                ></input>
                {codeMsg && (
                  <p className="text-red-600">Enter a valid access code</p>
                )}
                <div>
                  <button
                    className="bg-red-700 w-min px-4 py-2 text-lg rounded-xl mt-4 font-bold"
                    onClick={checkValidCode}
                  >
                    {!loading ? "CONTINUE" : "LOADING..."}
                  </button>
                </div>
              </div>

              <button
                onClick={() =>
                  window.scrollTo({
                    top: bottom.current.offsetTop - 200,
                    left: 0,
                    behavior: "smooth",
                  })
                }
              >
                <div className="flex m-auto items-center text-center justify-center pb-20">
                  <Image src="/images/arrow-down.png" width={20} height={13} />
                  <p className="font-semibold text-md pl-4">
                    SEE EVENT DETAILS
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/**BELOW FIRST PAGE DETAILS*/}
          <div className="px-8 py-8">
            <div ref={bottom} />
            <p className="text-2xl font-bold list">
              Fright at the Mansion 2023
            </p>
            <div className="flex space-x-2 pt-2">
              <a
                rel="noreferrer"
                href="https://www.instagram.com/p/CyOkbdKJC17/"
                target="_blank"
              >
                <Image src="/images/logo-ig.png" width={20} height={20} />
              </a>
            </div>

            <p className="pt-4 font-bold text-xl">Need an access code? </p>
            <p>DM a brother on the social team:</p>
            <ul className="list-disc pl-8">
              <li>
                Luke Doricic{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.instagram.com/lukedoricic/"
                  className="text-blue-400"
                >
                  @luukedoricic
                </a>
              </li>

              <li>
                Khaleel Lalani{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.instagram.com/khaleellalani/"
                  className="text-blue-400"
                >
                  @khaleellalani
                </a>
              </li>

              <li>
                Mick Dobrov{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.instagram.com/mick_dobrov/"
                  className="text-blue-400"
                >
                  @mick_dobrov
                </a>
              </li>
            </ul>

            <p className="pt-8">🎃BIG NEWS🎃</p>
            <p className="pt-3">
              🕸️Get ready for one of the biggest nights of the year! 👻The
              Brothers of Kappa Sigma are excited to bring you Fright at the
              Mansion on October 27th!
            </p>
            <p className="pt-3">
              Featuring our famous haunted hallway 🕯️ and blackout neon decor,
              your favourite house on campus is ready to run it back!🕺 🎉 🕷️
            </p>
            <p className="pt-3">
              Prepare for a spooky night with an unreal setup - and don’t forget
              to bring a costume🦇
            </p>
            <p className="pt-3">🚨Guestlist Needed🚨</p>
            <p className="pt-6">WHEN: Friday, October 27th, 9:00pm.</p>
            <p className="">
              WHERE: 2880 Westbrook Mall, First House on the Left
            </p>
            <p>
              SAFETY: If at any point you need any help, go to a person wearing
              KΣ letters and say “COBALT” to get immediate assistance.
            </p>

            <p className="pt-6">PLEASE NOTE</p>
            <ul className="list-disc pl-8">
              <li>Valid UBC ID required for entry</li>
              <li>Must be on guestlist to enter</li>
              <li>No bags, backpacks, or glass bottles</li>
              <li>Haunted hallway from 10PM - 12PM</li>
            </ul>

            <p className="pt-8">
              FOLLOW
              <a
                rel="noreferrer"
                href="https://www.instagram.com/kappasigmaubc/"
                target="_blank"
                className="text-blue-400 "
              >
                {" "}
                @kappasigmaubc{" "}
              </a>{" "}
              on instagram for up to date event info and updates
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FrightAtMansion;
