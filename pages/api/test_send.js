import axios from 'axios';

// Calls an external API to generate a qr code for the given data - returns an image
const generateQRCode = (data) => {
    const qr = require('qr-image');

    const qr_svg = qr.imageSync(data, { type: 'png' });
    const qr_str = 'data:image/png;base64,' + qr_svg.toString('base64');

    return qr_str
}

const createPdf = async () => {
    const PDFDocument = require('pdfkit');
    const { Base64Encode } = require('base64-stream');

    // instantiate the library
    const doc = new PDFDocument; 

    // pipe to a writable stream which would save the result into the same directory
    doc.text("Koachella 2022 Ticket")
    var finalString = ''; // contains the base64 string
    var stream = doc.pipe(new Base64Encode());

    stream.on('data', function(chunk) {
        finalString += chunk;
    });
    
    stream.on('end', function() {
        sendMail("havenmakayla@hotmail.ca", finalString)
    });
    
    doc.image(generateQRCode(""))
    doc.end();

}

const sendMail = async (toEmail, pdfData) => {
    let nodemailer = require('nodemailer')

    const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.porkbun.com",
        auth: {
          user: 'noreply@koachellaubc.com ',
          pass: 'Hunter1?23',
        },
        secure: true,
      })

      const mailData = {
        from: 'noreply@koachellaubc.com',
        to: toEmail,
        subject: `Order Confirmation - Koachella`,
        text: "This is a demo email, hopefully its working",
        attachments: {
            filename: `ticket.pdf`,
            content: pdfData,
            encoding: 'base64',
        }
       }

       transporter.sendMail(mailData, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info)
      })
}


async function handler(req, res) {  
    createPdf()
}

export default handler