var nodemailer = require("nodemailer");
var config = require('config');

exports.sendPasswordResetEmail = function(username, token, hostname) {

  var smtpTransport = nodemailer.createTransport("SMTP", config.get('mailconfig'));

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: "ed@maidavale.org", // sender address
    to: username, // list of receivers};

    subject: "Password reset", // Subject line
    generateTextFromHTML: true,
    html: "Please reset your password by visiting <a href=\"http://" + hostname + "/newpassword/#?token=" + token + "\">Reset</a>"
  };

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    smtpTransport.close(); // shut down the connection pool, no more messages
  });
};
