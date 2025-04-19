import nodemailer from "nodemailer";

let authEmail = process.env.auth_user;
let authPassword = process.env.auth_password;

let transporter = nodemailer.createTransport({
  host: "mail.schoolofinnovationn.com",
  port: 465,
  secure: true,
  auth: {
    user: `${authEmail}`,
    pass: `${authPassword}`,
  },
});

function sendRegistrationEmail(userEmail, code) {
  let mailOptions = {
    from: authEmail,
    to: userEmail,
    subject: "Your Activation Code",
    text: `Welcome! Your activation code is: ${code}`,
    html: `<p>Welcome! Your activation code is: <strong>${code}</strong></p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Email error:", error);
    } else {
      console.log("Activation code sent:", info.response);
    }
  });
}

export default sendRegistrationEmail;
