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
     "https://koachellaubc.com/images%2Fticket_template.png"
   );
   doc.image(ticketTemplate, 0, 0, { width: 620, height: 800 });
   //doc.image("public/images/ticket_template.png", 0, 0, {width: 620, height: 800})
 
   doc.fontSize(15).font("Helvetica-Bold").text(ticket_id, 353, 50);
 
   //'./public/uploads'
   //doc.image("phone-icon.jpg", 65, 260, {width: 50});
 
   doc
     .fontSize(40)
     .font("Helvetica-Bold")
     .text(session.metadata.name, 2, 300, { width: 620, align: "center" });
   doc
     .fontSize(25)
     .text(session.metadata.ticketName, 2, 355, { width: 620, align: "center" });
   doc.image(
     generateQRCode("https://koachellaubc.com/ticket/" + ticket_id),
     184,
     416,
     { width: 260 }
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
 
 const generateReciept = async (session) => {
   const PDFDocument = require("pdfkit");
 
   // instantiate the library
   const doc = new PDFDocument();
 
   const receiptTemplate = await fetchImage(
     "https://koachellaubc.com/images%2Freceipt_template.png"
   );
   doc.image(receiptTemplate, 0, 0, { width: 620, height: 800 });
 
   
   doc.text(moment().format("MMMM Do YYYY, h:mm:ss a"), 200, 266);
   doc.text(session.metadata.name, 100, 297);
   doc.text(session.customer_details.email, 100, 327);
 
   doc.fontSize(18);
   doc.text(session.metadata.ticketName, 80, 410);
   doc.text("Tax/Fees", 80, 440);
   doc.text("Total", 80, 500);
 
   doc.font("Helvetica-Bold");
   doc.text(
     "$" + Math.round((session.amount_total / 100 - 1.44) * 100) / 100,
     470,
     410
   );
   doc.text("$1.44", 470, 440);
   doc.text("$" + session.amount_total / 100, 470, 510);
   doc.font("Helvetica");
 
   doc.end();
 
   const pdfStream = await getStream.buffer(doc);
   return pdfStream;
 };
 
 // Handler to send email with content
 const sendMail = async (toEmail, ticketPdf, receiptPdf, session) => {
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
     subject: `Order Confirmation/Ticket - Koachella 2022`,
     text: `
     Hello ${session.metadata.name}}:
 
     Thank you for your purchase of a Koachella 2022 ticket! \n
 
     You can find your ticket attached. \n
 
     Ticket Info: \n
     ${session.metadata.ticketName} x1 \n
     ${session.metadata.name} \n
 
     Event Details: \n
     7:00PM, Saturday, March 19th, 2022 \n
     2880 Wesbrook Mall, First House on the Left \n
 
 
     We look forward to seeing you there, please arrive on time as the event will start shortly after 7:00PM. \n
 
 
     Enjoy the event, and stay safe! \n
 
 
     This email was sent from an address that cannot accept incoming email. Please do not reply to this message. \n
     `,
 
 
     html: `
     <div id="gmail-:5au" class="gmail-Ar gmail-Au gmail-Ao">
   <div id="gmail-:55r" class="gmail-Am gmail-Al editable gmail-LW-avf gmail-tS-tW gmail-tS-tY" style="direction: ltr; min-height: 590px;" tabindex="1" role="textbox" aria-label="Message Body" aria-multiline="true">Hello ${session.metadata.name}: 
     <br>
     <br>Thank you for your purchase of a 
     <span class="LI ng" data-ddnwab="PR_1_0" aria-invalid="spelling">Koachella</span> 2022 ticket! 
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
     <br>7:00PM, Saturday, March 19th, 2022 
     <br>2880 Wesbrook Mall, First House on the Left 
     <br>
     <br>
     <br>We look forward to seeing you there, please arrive on time as the event will start shortly after 7:00PM. 
     <br>
     <br>
     <br>
     <strong>Enjoy the event!</strong> 
     <br>
     <br>
     <br>
     <br>KOACHELLA 2022
     <br>PRESENTED BY KAPPA SIGMA
     <br>
     <br>
     <br>This email was sent from an address that cannot accept incoming email. Please do not reply to this message.
   </div>
 </div>
     
     `, 
     attachments: [
       {
         filename: `koachella_ticket.pdf`,
         content: ticketPdf,
         encoding: "base64",
       }
     ],
   };
 
   await transporter.sendMail(mailData);
 };
 
 const fulfillPurchase = async (session) => {
   // Create ticket id
   const ticket_id = generateRandomCode(12);
 
   // Disable access code in db
   console.log("disabling access code");
   const accessCode = session.metadata.accessCode;
   console.log(session.metadata.accessCode);
 
   const { res, error } = await supabase
     .from("access_codes")
     .update({ valid: false })
     .match({ code: accessCode });
 
   console.log("disabled");
   console.log(res);
   console.log(error);
 
   // add ticket to db
   const newTicket = {
     code: ticket_id,
     name: session.metadata.ticketName || "",
     customer_name: session.metadata.name || "",
     customer_email: session.customer_details.email || "",
   };
   await supabase.from("tickets").insert([newTicket]);
 
   const ticketPdf = await generateTicket(session, ticket_id);
   const receiptPdf = await generateReciept(session);
 
   await sendMail("colin.grob87@gmail.com", ticketPdf, receiptPdf, session);
 };
 
 export const config = { api: { bodyParser: false } };
 
 const webhookHandler = async (req, res) => {
   
    const session = {
        customer_details: {
            email: "colin.grob87@gmail.com",
        },
        metadata: {
            ticketName: "Koachella 2022 Tier 3 Ticket",
            name: "Colin Grob",
            accessCode: "",
        }
    }
 

   await fulfillPurchase(session);

   console.log("Success");
 
   res.send({ recieved: true });
 };
 export default webhookHandler;
 