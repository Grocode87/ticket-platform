import generateRandomCode from "../../utils/generate";
import { supabase } from "../../utils/supabaseClient";

const handler = async (req, res) => {

  const password = req.query.password

  if(password == process.env.DASHBOARD_PASS) {
    res.send({ valid: true });
  } else {
    res.send({ valid: false });
  }
};

export default handler;
