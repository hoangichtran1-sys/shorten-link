import { Elysia } from "elysia";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, reviews } from "@/db/schema";
import { sendEmail } from "@/lib/send-mail";
import { env } from "@/lib/env";
import { contactFormSchema } from "@/modules/marketing/schemas";

export const otherRouter = new Elysia({ name: "other-router", prefix: "/other" })
    .get("/user-with-review", async () => {
        const data = await db
            .select({
                name: users.name,
                email: users.email,
                type: users.type,
                review: reviews,
            })
            .from(users)
            .leftJoin(reviews, eq(reviews.userId, users.id))
            .orderBy(desc(users.createdAt));

        return data;
    })
    .post(
        "/subscriber",
        async ({ body }) => {
            const htmlEmailSubscribe = `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #28a745;">
                    <h2 style="color: #28a745;">Đăng ký thành công!</h2>
                    <p>Chúc mừng bạn! Email <strong>${body.email}</strong> đã đăng lý để nhận thông tin mới nhất.</p>
                    <p>Bạn sẽ sớm nhận được các thông báo chính thức từ phía chúng tôi.</p>
                </div>
            `;

            await sendEmail({
                toEmail: body.email,
                subject: "Subscribe to our newsletter",
                html: htmlEmailSubscribe,
            });

            return { success: true };
        },
        {
            body: z.object({ email: z.email() }),
        },
    )
    .post(
        "/contact",
        async ({ body }) => {
            const { firstName, lastName, email, subject, message } = body;

            const htmlEmailContact = `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #17a2b8;">
                    <h2 style="color: #17a2b8;">Vấn đề: ${subject}</h2>
                    <p>Bạn nhận được yêu cầu hỗ trợ từ khách hàng <strong>${firstName} ${lastName}</strong>.</p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Nội dung:</strong> ${message}</p>
                    </div>
                </div>
            `;

            await sendEmail({
                fromEmail: email,
                fromName: `${firstName} ${lastName}`,
                toEmail: env.SENDER_EMAIL,
                subject,
                html: htmlEmailContact,
            });

            return { success: true };
        },
        {
            body: contactFormSchema,
        },
    );
