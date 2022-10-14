import { supabase } from "../../utils/supabaseClient";

const handler = async (req, res) => {
  console.log("backend checking code");
  // add to supabase
  const db_data = await supabase
    .from("access_codes")
    .select()
    .eq("code", req.query.code);

  console.log(db_data);
  let valid = false;
  let sorority = false;
  let sorority_name = null;

  if (db_data.data && db_data.data.length > 0) {
    if (db_data.data[0].valid) {
      valid = true;
      sorority = db_data.data[0].sorority;
      sorority_name = db_data.data[0].sorority_name;
    }
  }

  // return code
  res.send({
    code: req.query.code,
    valid: valid,
    sorority: sorority,
    sorority_name: sorority_name,
  });
};

export default handler;
