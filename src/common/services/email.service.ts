import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    try {
        await transporter.sendMail({
            from: `"Social App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
    } catch (err: any) {
        console.error('⚠️ Email sending failed (تجاهله لو لسه مش حاطط بيانات إيميل حقيقية):', err.message);
    }
};