import nodemailer from "nodemailer";  // nodemailer exports default

const SendEmailUtility = async (EmailTo, EmailText, EmailSubject) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: { rejectUnauthorized: false },
    });

    let mailOptions = {
        from: `Inventory <${process.env.EMAIL_SENDER}>`,
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText,
    };

    return await transporter.sendMail(mailOptions);
};

export default SendEmailUtility;
