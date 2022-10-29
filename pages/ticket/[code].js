import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";

const TicketCode = (props) => {
  const [checkedIn, setCheckedIn] = useState(false);
  console.log(props);
  const code = props.code;

  const handleCheckIn = async () => {
    await axios.get(
      "https://www.ksigubcevents.com/api/ticket/set_ticket_used?code=" + code
    );
    setCheckedIn(true);
  };

  return (
    <div>
      {!checkedIn ? (
        <div>
          {props.valid ? (
            <div
              className={
                "w-full min-h-screen text-white font-bold flex flex-col justify-between " +
                (!props.used ? "bg-green-700" : "bg-red-700")
              }
            >
              <div className="m-auto text-center">
                <p className="text-3xl">{!props.used ? "VALID" : "INVALID"}</p>
                {props.used && <p>ALREADY USED</p>}
                <p className="text-2xl pt-8">{props.customer_name}</p>
                <p>{props.name}</p>
              </div>
              {!props.used && (
                <button
                  className="text-center mb-24 mx-4 bg-green-800"
                  onClick={handleCheckIn}
                >
                  <p className="text-xl p-4 border-2">CHECK IN</p>
                </button>
              )}
            </div>
          ) : (
            <div
              className={
                "w-full min-h-screen text-white font-bold flex flex-col justify-between " +
                "bg-red-700"
              }
            >
              <div className="m-auto text-center">
                <p className="text-3xl">INVALID TICKET</p>
                <p className="text-xl pt-4">DOES NOT EXIST</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={
            "w-full min-h-screen text-white font-bold flex flex-col justify-between bg-blue-600"
          }
        >
          <div className="m-auto text-center">
            <p className="text-3xl">{!props.used ? "VALID" : "INVALID"}</p>
            <p className="text-2xl pt-8">{props.customer_name}</p>
            <p>{props.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { code } = context.query;

  console.log("temping to get ticket with code: " + code);
  //const res = await axios.get("/api/ticket/get_ticket_info?code=" + code)
  let { data } = await axios.get(
    "https://www.ksigubcevents.com/api/ticket/get_ticket_info?code=" +
      context.query.code
  );

  const props = data.data;
  if (props) {
    console.log(props);
    return {
      props: { ...props, valid: true },
    };
  } else {
    return {
      props: {
        valid: false,
      },
    };
  }
}

export default TicketCode;
