const nodemailer = require('nodemailer');

/**
 * Email Service
 * Uses Nodemailer with Gmail SMTP for sending verification emails
 */

// Create transporter — uses Gmail by default
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

/**
 * Send gym owner verification email
 * @param {string} to - recipient email
 * @param {string} name - recipient name
 * @param {string} token - verification token
 */
const sendVerificationEmail = async (to, name, token) => {
    // If email credentials not configured, log and skip
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`📧 [DEV MODE] Verification email for ${to}`);
        console.log(`   Token: ${token}`);
        console.log(`   Link: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`);
        return { success: true, dev: true };
    }

    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`;

    const html = `
    <div style="font-family:'Inter',Arial,sans-serif;max-width:520px;margin:0 auto;background:#0a0a0f;border-radius:16px;overflow:hidden;border:1px solid #252530;">
      <div style="padding:32px;text-align:center;background:linear-gradient(135deg,#6366f1 0%,#10b981 100%);">
        <h1 style="color:#fff;font-size:24px;margin:0;">🏋️ GymBuddy</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Gym Owner Verification</p>
      </div>
      <div style="padding:32px;">
        <h2 style="color:#f1f5f9;font-size:20px;margin:0 0 12px;">Welcome, ${name}!</h2>
        <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px;">
          Thank you for registering as a <strong style="color:#10b981;">Gym Owner</strong> on GymBuddy.
          Please verify your email to activate your account and start listing your gym.
        </p>
        <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;text-decoration:none;border-radius:12px;font-weight:600;font-size:14px;">
          ✅ Verify My Email
        </a>
        <p style="color:#6b6b7b;font-size:12px;margin:24px 0 0;line-height:1.5;">
          If the button doesn't work, copy and paste this link:<br>
          <a href="${verifyUrl}" style="color:#818cf8;word-break:break-all;">${verifyUrl}</a>
        </p>
      </div>
      <div style="padding:16px 32px;border-top:1px solid #252530;">
        <p style="color:#4a4a5a;font-size:11px;margin:0;text-align:center;">
          This email was sent by GymBuddy. If you didn't create an account, please ignore this email.
        </p>
      </div>
    </div>`;

    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"GymBuddy" <${process.env.EMAIL_USER}>`,
            to,
            subject: '✅ Verify your GymBuddy Gym Owner Account',
            html
        });
        console.log(`📧 Verification email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error(`❌ Email send failed:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendVerificationEmail };
