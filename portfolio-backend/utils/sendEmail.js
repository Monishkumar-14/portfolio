import nodemailer from "nodemailer";

// ── Reusable transporter ──────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,  // Gmail App Password
  },
});

// ── Send notification to Monish ───────────────────────────────────
export const sendContactNotification = async ({ name, email, subject, message }) => {
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0f0f1f;color:#f1f5f9;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#7c3aed,#06b6d4);padding:28px 32px;">
        <h2 style="margin:0;font-size:20px;color:#fff;">📬 New Portfolio Message</h2>
        <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">Someone reached out via your portfolio</p>
      </div>
      <div style="padding:28px 32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:12px;width:90px;">From</td><td style="padding:8px 0;font-weight:600;font-size:14px;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:12px;">Email</td><td style="padding:8px 0;font-size:14px;color:#a78bfa;">${email}</td></tr>
          <tr><td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:12px;">Subject</td><td style="padding:8px 0;font-size:14px;">${subject}</td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:rgba(255,255,255,0.05);border-radius:12px;border:1px solid rgba(255,255,255,0.1);">
          <p style="margin:0;font-size:13px;line-height:1.8;color:rgba(255,255,255,0.75);">${message}</p>
        </div>
        <div style="margin-top:20px;">
          <a href="mailto:${email}" style="display:inline-block;padding:10px 22px;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;border-radius:100px;text-decoration:none;font-size:13px;font-weight:600;">Reply to ${name}</a>
        </div>
      </div>
      <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.07);font-size:11px;color:rgba(255,255,255,0.25);">Sent from your portfolio contact form · monishkumar.dev</div>
    </div>
  `;

  await transporter.sendMail({
    from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to:      process.env.ADMIN_EMAIL,
    replyTo: email,
    subject: `📬 New Message: ${subject} — from ${name}`,
    html,
  });
};

// ── Auto-reply to the sender ──────────────────────────────────────
export const sendAutoReply = async ({ name, email }) => {
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0f0f1f;color:#f1f5f9;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#7c3aed,#06b6d4);padding:28px 32px;">
        <h2 style="margin:0;font-size:20px;color:#fff;">Thanks for reaching out, ${name}! 🚀</h2>
      </div>
      <div style="padding:28px 32px;">
        <p style="font-size:14px;color:rgba(255,255,255,0.65);line-height:1.8;margin:0 0 16px;">I've received your message and will get back to you within <strong style="color:#a78bfa;">24 hours</strong>.</p>
        <p style="font-size:14px;color:rgba(255,255,255,0.65);line-height:1.8;margin:0 0 24px;">In the meantime, feel free to check out my work on <a href="https://github.com/Monishkumar-14" style="color:#06b6d4;">GitHub</a> or connect on <a href="https://linkedin.com/in/monish-kumar-b55774291" style="color:#a78bfa;">LinkedIn</a>.</p>
        <div style="padding:16px;background:rgba(255,255,255,0.05);border-radius:12px;border-left:3px solid #7c3aed;">
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5);">— Monishkumar E M</p>
          <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.3);">Full-Stack Developer · CEG, Anna University</p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from:    `"Monishkumar E M" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: `Got your message! I'll reply soon 👋`,
    html,
  });
};