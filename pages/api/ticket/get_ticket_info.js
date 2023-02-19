import { supabase } from "../../../utils/supabaseClient";

const handler = async (req, res) => {
  // add to supabase
  const { data, error } = await supabase
    .from("tickets_2")
    .select()
    .eq("code", req.query.code);

  console.log(data);
  console.log(error);
  // return code
  res.send({ data: data[0] || null });
};

export default handler;
