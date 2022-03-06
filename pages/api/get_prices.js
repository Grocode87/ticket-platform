import { supabase } from "../../utils/supabaseClient";

const handler = async (req, res) => {

    // get from supabase
    const prices = await supabase
    .from("prices")
    .select()


    // return code
    res.send({data: prices.data})
}


export default handler