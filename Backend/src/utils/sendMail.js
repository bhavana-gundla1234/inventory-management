const nodemailer = require("nodemailer");

const sendMail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Inventory System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Mail sent:", info.messageId);

    return true;
  } catch (error) {
    console.error("Mail error:", error);
    return false;
  }
};

module.exports = sendMail;