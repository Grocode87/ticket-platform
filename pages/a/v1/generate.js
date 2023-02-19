import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [codes, setCodes] = useState([]);
  const [sorority, setSorority] = useState(false);
  const [amount, setAmount] = useState(1);

  const generateCode = async () => {
    let sororityValid = false;

    const { data, error } = await axios.get("/api/get_prices");

    console.log(data);

    let prices = data.data;
    prices.forEach((price) => {
      if (price.name == "Exclusive Sorority" && price.active) {
        sororityValid = true;
      }
    });

    const codeData = await axios.get("/api/generate_code?amount=" + amount);

    setCodes(codeData.data.codes);
  };
  return (
    <div>
      <Head>
        <title>Koachella 2023</title>
        <meta name="description" content="Koachella UBC" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex py-8">
        <div className="w-1/2 m-auto">
          <p className="text-2xl pb-8">Generate a new ticket code</p>
          {/**
          <div className="pb-16">
            <p>Check this box if the code for a sorority girl</p>
            <input
              type="checkbox"
              onChange={(e) => {
                setSorority(e.target.checked);
              }}
            ></input>
          </div>
           */}

          <p>Amount</p>
          <input
            type={"number"}
            className="border-2 bg-gray-50 rounded-lg p-2"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />

          <div className="pt-6">
            <button
              className="rounded p-2 bg-blue-600 text-white w-min"
              onClick={generateCode}
            >
              <p>Generate</p>
            </button>
          </div>

          <div className="pt-8">
            <p>Generated codes</p>
            <div className="border-2 bg-gray-50 rounded-lg p-2">
              {codes.map((code) => {
                return <p key={code.code}>{code.code}</p>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
