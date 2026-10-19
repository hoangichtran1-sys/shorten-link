import { ApiError } from "./api-error";
import { brevo } from "./brevo";
import { env } from "./env";

type SendMail = {
    fromEmail?: string;
    fromName?: string;
    toEmail: string;
    toName?: string;
    subject: string;
    html: string;
};

export async function sendEmail({ fromEmail, fromName, toEmail, toName, subject, html }: SendMail) {
    return brevo.transactionalEmails
        .sendTransacEmail({
            sender: {
                name: fromName || env.SENDER_NAME,
                email: fromEmail || env.SENDER_EMAIL,
            },
            to: [{ email: toEmail, name: toName }],
            subject,
            htmlContent: html,
        })
        .catch(() => {
            throw ApiError.badRequest("Failed to send email");
        });
}
