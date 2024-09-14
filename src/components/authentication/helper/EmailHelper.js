import nodemailer from "nodemailer";

let authEmail = process.env.auth_user;
let authPassword = process.env.auth_password;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${authEmail}`,
    pass: `${authPassword}`,
  },
});

function sendRegistrationEmail(userEmail) {
    // Email content
    let mailOptions = {
      from: `${authEmail}`,
      to: userEmail,
      subject: 'Registration Successful',
      text: 'Welcome to our application. Thank you for registering.'
    };
  
    // Send email
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

export default sendRegistrationEmail;