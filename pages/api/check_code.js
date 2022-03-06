import { supabase } from "../../utils/supabaseClient";

const handler = async (req, res) => {
    console.log("backend checking code")
    // add to supabase
    const db_data = await supabase
    .from("access_codes")
    .select()
    .eq('code', req.query.code)

    console.log(db_data)
    let valid = false;
    if(db_data.data && db_data.data.length > 0) {
        if(db_data.data[0].valid) {
            valid = true;
        }
    }

    // return code
    res.send({ code: req.query.code, valid: valid})
}


export default handler