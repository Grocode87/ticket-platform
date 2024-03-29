import { supabase } from "../../../utils/supabaseClient";

const handler = async (req, res) => {
  // add to supabase
  await supabase
    .from("tickets_2")
    .update({ used: true })
    .match({ code: req.query.code });

  // return code
  res.send({ msg: "Success" });
};

export default handler;
