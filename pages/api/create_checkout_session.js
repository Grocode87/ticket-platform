import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price: req.body.priceId,
            quantity: 1,
          },
        ],
        allow_promotion_codes: true,
        metadata: {
          accessCode: req.body.accessCode,
          name: req.body.name,
          ticketName: req.body.ticketName,
        },
        customer_email: req.body.email,
        success_url: `${req.headers.origin}/payment/success`,
        cancel_url: `${req.headers.origin}/cart`,
      });

      res.status(200).json(session);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
  }
}
