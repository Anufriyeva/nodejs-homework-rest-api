const ElasticEmail = require("@elasticemail/elasticemail-client");
const dotenv = require("dotenv");

dotenv.config();

const { EM_API_KEY } = process.env;
const SENDER_EMAIL = "2281474@gmail.com";

const defaultClient = ElasticEmail.ApiClient.instance;
const { apikey } = defaultClient.authentications;
apikey.apiKey = EM_API_KEY;

const emailApi = new ElasticEmail.EmailsApi();

const sendEmail = (data) => {
  const { to, subject, html } = data;

  const emailMessage = ElasticEmail.EmailMessageData.constructFromObject({
    Recipients: [new ElasticEmail.EmailRecipient(to)],
    Content: {
      Body: [
        ElasticEmail.BodyPart.constructFromObject({
          ContentType: "HTML",
          Content: html,
        }),
      ],
      Subject: subject,
      From: SENDER_EMAIL,
    },
  });

  const cb = function (error, responseData, response) {
    if (error) {
      console.error(error.message);
    } else {
      console.log("Email sent successfully");
    }
  };

  emailApi.emailsPost(emailMessage, cb);
};

module.exports = sendEmail;