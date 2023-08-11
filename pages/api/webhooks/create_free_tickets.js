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

import moment from "moment";

import { buffer } from "micro";
import getStream from "get-stream";
import generateRandomCode from "../../../utils/generate";
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
  const ticketTemplate = await fetchImage(
    "https://www.ksigubcevents.com/images%2Fkoachella2023ticket.jpg"
  );
  doc.image(ticketTemplate, 0, 0, { width: 620, height: 800 });
  //doc.image("public/images/ticket_template.png", 0, 0, {width: 620, height: 800})

  doc
    .fontSize(15)
    .fillColor("white")
    .font("Helvetica-Bold")
    .text(ticket_id, 284, 586);

  //'./public/uploads'
  //doc.image("phone-icon.jpg", 65, 260, {width: 50});

  doc
    .fontSize(30)
    .fillColor("white")
    .font("Helvetica-Bold")
    .text(session.metadata.name, 2, 253, { width: 610, align: "center" });
  doc
    .fontSize(13)
    .fillColor("white")
    .text(session.metadata.ticketName, 2, 288, { width: 610, align: "center" });
  doc.image(
    generateQRCode("https://www.ksigubcevents.com/ticket/" + ticket_id),
    192,
    310,
    { width: 235 }
  );

  doc.end();

  const pdfStream = await getStream.buffer(doc);
  return pdfStream;
};

const fetchImage = async (src) => {
  const response = await fetch(src);
  const image = await response.buffer();

  return image;
};

// Handler to send email with content
const sendMail = async (toEmail, ticketPdf, session) => {
  let nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.porkbun.com",
    auth: {
      user: "noreply@ksigubcevents.com ",
      pass: "Hunter1?23",
    },
    secure: true,
  });

  const mailData = {
    from: "noreply@ksigubcevents.com",
    to: toEmail,
    subject: `Order Confirmation/Ticket - Koachella 2023`,
    text: `
     Hello ${session.metadata.name}},
 
     Thank you for your purchase of a Koachella 2023 ticket! \n
 
     You can find your ticket attached. \n
 
     Ticket Info: \n
     ${session.metadata.ticketName} x1 \n
     ${session.metadata.name} \n
 
     Event Details: \n
     7:30PM, Friday, March 10th, 2023 \n
     2880 Wesbrook Mall, First House on the Left \n
 
 
     We look forward to seeing you there, please arrive on time as the event will start shortly after 7:30PM. \n
 
 
     Enjoy the event, and stay safe! \n
 
 
     This email was sent from an address that cannot accept incoming email. Please do not reply to this message. \n
     `,

    html: `
     <div id="gmail-:5au" class="gmail-Ar gmail-Au gmail-Ao">
   <div id="gmail-:55r" class="gmail-Am gmail-Al editable gmail-LW-avf gmail-tS-tW gmail-tS-tY" style="direction: ltr; min-height: 590px;" tabindex="1" role="textbox" aria-label="Message Body" aria-multiline="true">Hello, 
     <br>
     <br>Thank you for your purchase of a 
     <span class="LI ng" data-ddnwab="PR_1_0" aria-invalid="spelling">Koachella</span> 2023 ticket! 
     <br>
     <br>
     <strong>You can find your ticket attached.</strong> 
     <br>
     <br>
     <strong>Ticket Info:</strong> 
     <br>
     ${session.metadata.ticketName} x1 
     <br>${session.metadata.name}
     <br>
     <br>
     <strong>Event Details:</strong> 
     <br>7:30PM, Friday, March 10th, 2023
     <br>2880 Wesbrook Mall, First House on the Left 
     <br>
     <br>
     <br>We look forward to seeing you there, please arrive on time as the event will start shortly after 7:30PM.
     <br>
     <br>
     <br>
     <strong>Enjoy the event!</strong> 
     <br>
     <br>
     <br>
     <br>KOACHELLA 2023
     <br>PRESENTED BY KAPPA SIGMA
     <br>
     <br>
     <br>This email was sent from an address that cannot accept incoming email. Please do not reply to this message.
   </div>
 </div>
     
     `,
    attachments: [
      {
        filename: `koachella-2023-ticket.pdf`,
        content: ticketPdf,
        encoding: "base64",
      },
    ],
  };

  await transporter.sendMail(mailData);
};
const fulfillPurchase = async (session) => {
  // Create ticket id
  const ticket_id = generateRandomCode(12);
  const accessCode = session.metadata.accessCode;

  // Get access code count from db
  const codeRes = await supabase
    .from("access_codes")
    .select("code, uses, sorority_name")
    .eq("code", accessCode);
  const codeData = codeRes.data[0];

  // increment uses of access code in db if access code exists
  if (codeData) {
    await supabase
      .from("access_codes")
      .update({ uses: codeData.uses + 1 })
      .eq("code", accessCode);
  }

  // Disable access code in db
  if (codeData && !codeData.sorority_name) {
    const { res, error } = await supabase
      .from("access_codes")
      .update({ valid: false })
      .match({ code: accessCode });
  }

  // add ticket to db
  const newTicket = {
    code: ticket_id,
    name: session.metadata.ticketName || "",
    customer_name: session.metadata.name || "",
    customer_email: session.customer_details.email || "",
    sorority: codeData?.sorority_name || "",
  };
  await supabase.from("tickets_2").insert([newTicket]);

  const ticketPdf = await generateTicket(session, ticket_id);

  await sendMail(session.customer_details.email, ticketPdf, session);
};

const webhookHandler = async (req, res) => {
  const session = {
    customer_details: {
      email: "colin.grob87@gmail.com",
    },
    metadata: {
      ticketName: "Koachella 2023 Tier 3 Ticket",
      name: "Free Ticket 6",
      accessCode: "AAAAA",
    },
    amount_total: 0,
  };

  await fulfillPurchase(session);

  console.log("Success");

  res.send({ recieved: true });
};
export default webhookHandler;
