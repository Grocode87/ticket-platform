import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    console.log("creating checkout session")
  if (req.method === "POST") {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items:  [{
            price: 'price_1KZgSdC5T4V1yXtqk8FtaDAP',
            quantity: 1,
        }],
        metadata: {'access_code': "this bitch works"},
        customer_email: "colin.grob87@gmail.com",
        success_url: `${req.headers.origin}`,
        cancel_url: `${req.headers.origin}`,
      });

      res.status(200).json(session);
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
  }
}
