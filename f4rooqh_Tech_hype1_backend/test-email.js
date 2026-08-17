const nodemailer = require("nodemailer");

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "sabbirmridha880@gmail.com",
      pass: "ybkp bvfc bwhg prwm",
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Farooq" <sabbirmridha880@gmail.com>',
      to: "sabbirmridha880@gmail.com",
      subject: "Test Mail from Script",
      text: "This is a test email.",
    });
    console.log("Email sent successfully: ", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

testEmail();
