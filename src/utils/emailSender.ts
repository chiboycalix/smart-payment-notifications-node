import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import {
  CLIENT_BASE_URL,
  MAIL_AUTH_PASS,
  MAIL_AUTH_USER,
  MAIL_FROM,
  MAIL_SERVICE,
} from "../config/env";

interface ITemplateData {
  emailType: string;
  token: string;
  username: string;
  subject: string;
  email: string;
}
const getEmailTemplate = (templateName: string, data: object): string => {
  const templateSource = fs.readFileSync(
    path.join(__dirname, "../templates", `${templateName}.html`),
    "utf8"
  );
  const template = Handlebars.compile(templateSource);
  return template(data);
};

const transporter = nodemailer.createTransport({
  service: MAIL_SERVICE,
  auth: {
    user: MAIL_AUTH_USER,
    pass: MAIL_AUTH_PASS,
  },
});

const htmlTemplate = (templateData: ITemplateData) => {
  let emailContent;

  switch (templateData.emailType) {
    case "forgotPassword":
      emailContent = getEmailTemplate("forgotPassword", {
        resetLink: CLIENT_BASE_URL + "/reset-password/" + templateData.token,
        name: templateData.username,
      });
      break;
    default:
      console.error("Invalid email type!");
  }

  return emailContent;
};

export const sendEmail = async (templateData: ITemplateData) => {
  const mailOptions = {
    from: MAIL_FROM,
    to: templateData.email,
    subject: templateData.subject,
    html: htmlTemplate(templateData),
  };
  await transporter.sendMail(mailOptions);
};
