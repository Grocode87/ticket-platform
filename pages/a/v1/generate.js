import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import axios from 'axios';

export default function Home() {
  const [code, setCode] = useState("")
  const [sorority, setSorority] = useState("")


  const generateCode = () => {
    let sororityValid = false
    axios.get("https://koachellaubc.com/api/get_prices").then(res => {
      res.data.data.forEach(price => {
        if(price.name == "Sorority" && price.active) {
          sororityValid = true
        }
      })
    })

    console.log("https://koachellaubc.com/api/generate_code?sorority=" + sororityValid ? sorority : false)
    axios.get("https://koachellaubc.com/api/generate_code?sorority=" + sororityValid ? sorority : false)
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
            <p className="text-2xl pb-8">Generate a new ticket code</p>
            <div className="pb-16">
              <p>Check this box if the code for a sorority girl</p><input type="checkbox" onChange={(e) => {setSorority(e.target.checked)}}></input>
            </div>
            <button className="rounded p-2 bg-blue-600 text-white w-min" onClick={generateCode}><p>Generate</p></button>
           
            <div className="pt-8">
                <input type={"text"} disabled={true} className="border-2 bg-gray-50 rounded-lg p-2" value={code} />
            </div>
            </div>
        </div>
    </div>
  );
}
