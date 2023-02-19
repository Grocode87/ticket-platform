import generateRandomCode from "../../utils/generate";
import { supabase } from "../../utils/supabaseClient";

const handler = async (req, res) => {
  //const forSorority = req.query.sorority;
  const amount = req.query.amount;

  // generate 6 digit random code
  // create an array of ojects called codes and initialize it to generate amount number of codes
  const codes = Array.from({ length: amount }, () => ({
    code: generateRandomCode(6),
    sorority: false,
  }));

  // add to supabase
  const { data, error } = await supabase.from("access_codes").insert(codes);

  console.log(data);
  console.log(error);
  // return code
  res.send({ message: "unique codes generated", codes: codes });
};

export default handler;
