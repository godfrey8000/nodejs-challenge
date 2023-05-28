const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const ejs = require("ejs");
const fs = require("fs");
const envconfig = require("dotenv").config();

// Function to send the email
async function sendEmail(records) {
  try {
    const emailUsername = process.env.EMAIL_USERNAME;
    const emailPassword = process.env.EMAIL_PASSWORD;

    // Load the email template
    const template = fs.readFileSync("views/emailTemplate.ejs", "utf-8");

    // Render the template with the records
    const html = ejs.render(template, { records });
    console.log("Rendered HTML:", html);
    // Configure the email transport
    const transporter = nodemailer.createTransport(
      smtpTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: emailUsername,
          pass: emailPassword,
        },
      })
    );

    // Define the email options
    const mailOptions = {
      from: "do_not_reply@northpole.com",
      to: "santa@northpole.com",
      subject: "Message to Santa",
      html: html,
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
  return false;
}

module.exports = { sendEmail };
