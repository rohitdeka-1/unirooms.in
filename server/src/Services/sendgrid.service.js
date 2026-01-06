import sgMail from "@sendgrid/mail";
import config from "../Config/env.config.js";
import chalk from "chalk";

// Initialize SendGrid
if (config.SENDGRID_API_KEY) {
  sgMail.setApiKey(config.SENDGRID_API_KEY);
  console.log(chalk.magenta("✅ SendGrid email service is ready"));
  console.log(chalk.cyan(`📧 Sending from: ${config.EMAIL_FROM || config.GMAIL_USER}`));
} else {
  console.error(chalk.red("❌ SENDGRID_API_KEY not configured"));
}

/**
 * Send email using SendGrid
 */
export const sendEmailSendGrid = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: {
        email: config.EMAIL_FROM || config.GMAIL_USER,
        name: config.EMAIL_FROM_NAME || "UniRooms",
      },
      subject,
      html,
    };

    console.log(`📤 Sending email via SendGrid to: ${to}`);
    const result = await sgMail.send(msg);
    console.log(`✅ Email sent via SendGrid: ${result[0].statusCode}`);
    
    return { 
      success: true, 
      messageId: result[0].headers['x-message-id'],
      statusCode: result[0].statusCode
    };
  } catch (error) {
    console.error("❌ SendGrid error:", error.message);
    if (error.response) {
      console.error("SendGrid response:", error.response.body);
    }
    throw error;
  }
};

export default { sendEmailSendGrid };
