import generateRandomCode from "../../utils/generate";
import { supabase } from "../../utils/supabaseClient";

const handler = async (req, res) => {

    const {data} = await supabase
    .from("tickets")
    .select()

    let tickets = {}
    data.forEach(ticket => {
        if(ticket.name in tickets) {
            tickets[ticket.name] += 1
        } else {
            tickets[ticket.name] = 1
        }
    });

    let salesData = []
    for (const name in tickets) {
        salesData.push({name: name, amount: tickets[name]})
    }

    res.send({ sales: salesData })
};

export default handler;
