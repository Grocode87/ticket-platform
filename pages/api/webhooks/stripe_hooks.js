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

import { buffer } from "micro";
import getStream from 'get-stream';
import generateRandomCode from '../../../utils/generate';
import { supabase } from "../../../utils/supabaseClient";

// Calls an external API to generate a qr code for the given data - returns an image
const generateQRCode = (data) => {
  const qr = require("qr-image");

  const qr_svg = qr.imageSync(data, { type: "png" });
  const qr_str = "data:image/png;base64," + qr_svg.toString("base64");

  return qr_str;
};

const generateTicket = async (session, ticket_id) => {
  const PDFDocument = require("pdfkit");

  // instantiate the library
  const doc = new PDFDocument();

  //IMAGE
  doc.image("koachella.jpg", 75, 50, {width: 250});
  doc.text("Saturday, March 19th at 8:00PM", 80, 130)
  doc.text("First house on the left", 80, 160)
  doc.text("2880 Westbrook Mall", 80, 180)
  
  doc.text("Ticket ID: " + ticket_id, 80, 220)

  
  doc.image("phone-icon.jpg", 65, 260, {width: 50});
  doc.font('Helvetica-Bold').text("Be ready to present this", 120, 270)
  doc.font('Helvetica-Bold').text("ticket at the door for entry", 120, 290)

  doc.fontSize(30).font('Helvetica-Bold').text(session.metadata.name, 25, 350, {align: "center"})
  doc.fontSize(15).text(session.metadata.ticketName, 25, 390, {align: "center"})
  doc.image(generateQRCode("https://koachellaubc.com/ticket/" + ticket_id), 120, 410, {width: 300});

  doc.end();

  
  const pdfStream = await getStream.buffer(doc);
  return pdfStream
};


const generateReciept = async (session) => {
  const PDFDocument = require("pdfkit");

  // instantiate the library
  const doc = new PDFDocument();

  doc.text("Purchase Receipt", 80, 50)
  doc.text("Koachella 2022", 80, 70)
  doc.text("Date of Purchase: XXXXXXXXX", 80, 110)
  doc.text("Name: " + session.metadata.name, 80, 130)
  doc.text("Email: " + session.customer_details.email, 80, 150)
  
  doc.text(session.metadata.ticketName, 80, 250)
  doc.text("Tax/Fees", 80, 270)
  doc.text("Total", 80, 310)

  doc.font('Helvetica-Bold')
  doc.text("$" + session.amount_total / 100, 350, 250)
  doc.text("$0.00", 350, 270)
  doc.text("$" + session.amount_total / 100, 350, 310)
  doc.font('Helvetica')

  doc.text("All sales are final. We are not able to offer refunds or exchanges for tickets.", 110, 420)
  doc.text("Thank you for your purchase. Enjoy the event!", 80, 435, {align: "center"})

  doc.end();

  const pdfStream = await getStream.buffer(doc);
  return pdfStream
};

// Handler to send email with content
const sendMail = async (toEmail, ticketPdf, receiptPdf) => {
  let nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.porkbun.com",
    auth: {
      user: "noreply@koachellaubc.com ",
      pass: "Hunter1?23",
    },
    secure: true,
  });

  const mailData = {
    from: "noreply@koachellaubc.com",
    to: toEmail,
    subject: `Order Confirmation - Koachella`,
    text: "Thank you for your purchase of a Koachella 2022 Ticket, your ticket and receipt are attached",
    attachments: [{
      filename: `koachella_ticket.pdf`,
      content: ticketPdf,
      encoding: "base64",
    },
    {
      filename: `purchase_receipt.pdf`,
      content: receiptPdf,
      encoding: "base64",
    }],
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

const fulfillPurchase = async (session) => {
  
  console.log(session);
  console.log("fulfilling purchase")
  // Disable guestlist id

  // Create ticket id
  const ticket_id = generateRandomCode(12);

  try {
  // Disable access code in db
  const accessCode = session.metadata.accessCode;
  supabase
  .from("access_codes")
  .update({ valid: false })
  .match({ code: accessCode }).then(({res, error}) => {
    console.log("then")
    console.log(error)
  });
  console.log("disabled access code")
  } catch(e) {
    console.log("an error occured")
    console.log(e)
  }
  // add ticket to db
  console.log("adding ticket")
  //const newTicket = {
  //  code: ticket_id,
  //  name: session.metadata.ticketName || "",
  //  customer_name: session.metadata.name || "",
  //  customer_email: session.customer_details.email || "",
  //}
  //const {res, error} = await supabase.from("tickets").insert([newTicket]);

  //console.log(res)
  //console.log(error)
  console.log("added ticket")
  


  const ticketPdf = await generateTicket(session, ticket_id)
  const receiptPdf = await generateReciept(session)
  
  sendMail(session.customer_details.email, ticketPdf, receiptPdf)


};




export const config = { api: { bodyParser: false } };

const webhookHandler = async (req, res) => {
  console.log("recieved hook")
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
