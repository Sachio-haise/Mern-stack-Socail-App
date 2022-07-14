import nodemailer from "nodemailer";

export const sentMail = async (data) => {
  var transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "aungkaungmyatkpg777@gmail.com",
      pass: "tqetfwxztfmasblc",
    },
  });

  var mailOptions = {
    from: "aungkaungmyatkpg777@gmail.com",
    to: data.to,
    subject: data.subject,
    text: data.text, // plain text body
    html: data.html, //
  };
  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else if (info) {
      console.log(info);
    }
  });
};
