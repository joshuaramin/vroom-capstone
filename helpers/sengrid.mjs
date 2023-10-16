import SGrid from "@sendgrid/mail";

SGrid.setApiKey(process.env.SENDGRIDAPI);

export const SENDMAIL = (email, subject, message) => {
   SGrid.send({
      to: email,
      from: "raminjoshua05@gmail.com",
      subject,
      content: [{ type: "text/html", value: message }],
   });
};
