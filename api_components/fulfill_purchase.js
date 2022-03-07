import { resolve } from "path";
import generateRandomCode from "../utils/generate";
import { supabase } from "../utils/supabaseClient";
import getStream from 'get-stream';

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

  // Disable access code in db
  const accessCode = session.metadata.accessCode;
  await supabase
  .from("access_codes")
  .update({ valid: false })
  .match({ code: accessCode });
  console.log("disabled access code")

  // add ticket to db
  console.log("adding ticket")
  const newTicket = {
    code: ticket_id,
    name: session.metadata.ticketName || "",
    customer_name: session.metadata.name || "",
    customer_email: session.customer_details.email || "",
  }
  const {res, error} = await supabase.from("tickets").insert([newTicket]);

  console.log(res)
  console.log(error)
  console.log("added ticket")
  


  const ticketPdf = await generateTicket(session, ticket_id)
  const receiptPdf = await generateReciept(session)
  sendMail("apsindhoor@gmail.com", ticketPdf, receiptPdf)

  // Get receipt

  // Send email and attach
  // - receipt
  // - qr code
  //createPdf()



  // 
};

export default fulfillPurchase
