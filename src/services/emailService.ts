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

const transporter = nodemailer.createTransport({
  service: MAIL_SERVICE,
  auth: {
    user: MAIL_AUTH_USER,
    pass: MAIL_AUTH_PASS,
  },
});

class MailService {
  async send(data: any, templateName: string) {
    const mailOptions = {
      from: MAIL_FROM,
      to: data.email,
      subject: data.subject,
      html: this.htmlTemplate(data),
    };
    await transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(user: any) {
    try {
      await this.send(user, "Welcome");
    } catch (error) {
      console.error(error);
    }
  }

  async sendPasswordResetEmail(user: any) {
    try {
      await this.send(user, "Password Reset");
    } catch (error) {
      console.error(error);
    }
  }

  async sendVerificationEmail(user: any) {
    try {
      await this.send(user, "Email Verification");
    } catch (error) {
      console.error(error);
    }
  }

  async sendEmailChangeEmail(user: any) {
    try {
      await this.send(user, "Email Change");
    } catch (error) {
      console.error(error);
    }
  }

  async sendEmailChangeVerificationEmail(user: any) {
    try {
      await this.send(user, "Email Change Verification");
    } catch (error) {
      console.error(error);
    }
  }

  async sendPasswordChangedConfirmationEmail(user: any) {
    try {
      await this.send(user, "Password Changed");
    } catch (error) {
      console.error(error);
    }
  }

  async sendAccountDeletedEmail(user: any) {
    try {
      await this.send(user, "Account Deleted");
    } catch (error) {
      console.error(error);
    }
  }

  getTemplate(templateName: string, data: any): string {
    const templateSource = fs.readFileSync(
      path.join(__dirname, "../templates", `${templateName}.html`),
      "utf8"
    );
    const template = Handlebars.compile(templateSource);
    return template(data);
  }

  async sendEmail(templateName: string, data: any) {
    await this.send(data, templateName);
  }

  async sendEmailVerificationEmail(user: any) {
    try {
      await this.sendEmail("verifyEmail", {
        email: user.email,
        username: user.username,
        subject: "Email Verification",
        verifyLink: `http://localhost:3000/verify-email?token=${user.verifyEmailToken}`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  htmlTemplate(templateData: any) {
    let emailContent;

    switch (templateData.emailType) {
      case "forgotPassword":
        emailContent = this.getTemplate("forgotPassword", {
          resetLink: CLIENT_BASE_URL + "/reset-password/" + templateData.token,
          name: templateData.username,
        });
        break;
      default:
        console.error("Invalid email type!");
    }

    return emailContent;
  }
}
