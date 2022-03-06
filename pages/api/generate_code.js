import generateRandomCode from "../../utils/generate";
import { supabase } from "../../utils/supabaseClient";



const handler = async (req, res) => {
  // generate 6 digit random code
  const code = generateRandomCode(6);

  // add to supabase
  const { data, error } = await supabase
    .from("access_codes")
    .insert([{ code: code }]);

    console.log(data)
    console.log(error)
  // return code
  res.send({ message: "unique code generated", code: code });
};

export default handler;
