/**
 * Webhook
 *
 * - Listens to successful payments
 *
 * - Disables the used guestlist code - ALMOST DONE
 * - Generates a ticket code - DONE
 *
 * - Sends a receipt to the email - ALMOST DONE
 * - Sends a ticket email with - JUST NEEDS BETTER DESIGN AND FULL INTEGRATION
 *     - QR code from ticket code
 *     - Event details
 *     - Thank you for your purchase
 */

 import initStripe from "stripe";
import Cors from "micro-cors";
import fulfillPurchase from "../../../api_components/fulfill_purchase";
import { buffer } from "micro";

export const config = { api: { bodyParser: false } };

const webhookHandler = async (req, res) => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;
  const reqBuffer = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }


  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log(session);
    fulfillPurchase(session);
  }

  // Successfully constructed event
  console.log("Success:", event.id);

  res.send({ recieved: true });
};
export default webhookHandler;
