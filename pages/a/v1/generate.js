import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import axios from 'axios';

export default function Home() {
  const [code, setCode] = useState("")


  const generateCode = () => {
    axios.get(`http://localhost:3000/api/generate_code`)
    .then(res => {
      setCode(res.data.code)
    })
  }
  return (
    <div>
      <Head>
        <title>Koachella UBC</title>
        <meta name="description" content="Koachella UBC" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
        <div className="flex py-8">
            <div className="w-1/2 m-auto">
            <p className="text-2xl pb-4">Generate a new ticket code</p>
            <button className="rounded p-2 bg-blue-600 text-white w-min" onClick={generateCode}><p>Generate</p></button>
            <div className="pt-8">
                <input type={"text"} disabled={true} className="border bg-gray-50 rounded-lg" value={code} />
            </div>
            </div>
        </div>
    </div>
  );
}
