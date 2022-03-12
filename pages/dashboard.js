import axios from "axios";
import { useContext, useEffect, useState } from "react";

const Dashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")
  const [password, setPassword] = useState("");
  const [salesData, setSalesData] = useState([]);

  useEffect(()=> {
    axios.get(
        "/api/get_ticket_sales"
      ).then(res => {
          console.log(res.data)
        setSalesData(res.data.sales)
      });
  }, [])
  const login = async () => {
    const res = await axios.get(
        "/api/check_login?password=" + password
      );
    
    console.log(res)
    if(res.data.valid) {
        setLoggedIn(true)
        setErrorMsg("")
    } else {
        setErrorMsg("Incorrect password")
    }
  }

  return (
    <div className="w-full md:w-1/2 px-8 md:px-0 m-auto pt-10">
      {!loggedIn ? (
        <div>
          <p>Password</p>
          <input type="password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login}>Submit</button>
          {errorMsg && (
              <p className="text-red-600">{errorMsg}</p>
          )}
        </div>
      ) : (
        <div>
            <p className="font-bold text-xl pb-8">Sales Data</p>
            <div className="w-full">
                {salesData.map(sale => {
                    return (
                        <div className="flex justify-between border-b py-4 items-center" key={sale.name}>
                            <span>{sale.name}</span>
                            <span className="pl-4 font-bold">{sale.amount}</span>
                        </div>
                    )
                })}
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
