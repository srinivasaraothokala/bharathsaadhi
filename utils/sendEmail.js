const transporter = require('./emailConfig');

module.exports = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"BharathShaadi" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};
