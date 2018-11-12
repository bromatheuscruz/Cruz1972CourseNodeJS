const config = require("../config");
const sendgrid = require("sendgrid")(global.MAIL_TMPL);

exports.send = async (to, subject, body) => {
  sendgrid.send({
    to: to,
    from: "hello@cruz.io",
    subject: subject,
    html: body
  });
};
