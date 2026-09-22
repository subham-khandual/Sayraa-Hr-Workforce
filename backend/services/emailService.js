const nodemailer = require('nodemailer');

const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || '';
  const pass = process.env.SMTP_PASS || process.env.GMAIL_PASS || '';

  if (!user || !pass || user.includes('your-email') || pass.includes('your-app-password')) {
    console.warn('⚠️  SMTP credentials not configured. Emails will be logged to console only.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();
  const mailOptions = {
    from: `"Sayraa AI HR" <${process.env.SMTP_USER || process.env.GMAIL_USER || 'noreply@sayraa.ai'}>`,
    to,
    subject,
    text,
    html
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Real Email Sent to ${to} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('Email send error:', err);
      return { success: false, error: err.message };
    }
  } else {
    console.log('📧 [DEV EMAIL]', { to, subject, text });
    return { success: true, messageId: 'dev-log-' + Date.now() };
  }
};

const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  const subject = purpose === 'register' ? 'Verify your Sayraa AI HR account' :
                  purpose === 'login' ? 'Your Sayraa AI HR login code' :
                  'Your Sayraa AI HR verification code';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #2E0854; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">SAYRAA AI HR</h1>
        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Workforce Intelligence</p>
      </div>
      <div style="background: #f8f9fa; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e9ecef;">
        <h2 style="color: #2E0854; margin-top: 0;">Your Verification Code</h2>
        <p style="color: #495057; line-height: 1.6;">Use the following OTP to ${purpose === 'register' ? 'complete your registration' : 'sign in to your account'}. This code will expire in 10 minutes.</p>
        <div style="background: white; border: 2px dashed #2E0854; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; color: #2E0854; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #6c757d; font-size: 13px;">If you did not request this code, please ignore this email.</p>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px;">
          © 2026 Sayraa AI HR Workforce. All rights reserved.
        </div>
      </div>
    </div>
  `;

  const text = `Your Sayraa AI HR verification code is: ${otp}\nThis code will expire in 10 minutes.\nIf you did not request this code, please ignore this email.`;

  return await sendEmail({ to: email, subject, html, text });
};

const sendAssessmentInvite = async (candidateEmail, candidateName, jobTitle, appId, jobId) => {
  const subject = `Skills Assessment Invitation - ${jobTitle}`;
  const assessmentLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/assessment?appId=${appId}&jobId=${jobId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #2E0854; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">SAYRAA AI HR</h1>
        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Assessment Invitation</p>
      </div>
      <div style="background: #f8f9fa; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e9ecef;">
        <h2 style="color: #2E0854; margin-top: 0;">Hi ${candidateName},</h2>
        <p style="color: #495057; line-height: 1.6;">You have been invited to complete a skills assessment for the <strong>${jobTitle}</strong> position.</p>
        <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #e9ecef;">
          <h3 style="color: #2E0854; margin-top: 0; font-size: 16px;">Assessment Details</h3>
          <p style="margin: 8px 0; color: #495057;"><strong>Position:</strong> ${jobTitle}</p>
          <p style="margin: 8px 0; color: #495057;"><strong>Duration:</strong> 45 minutes</p>
          <p style="margin: 8px 0; color: #495057;"><strong>Type:</strong> Multiple Choice & Coding</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${assessmentLink}" style="background: #2E0854; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">Start Assessment</a>
        </div>
        <p style="color: #6c757d; font-size: 13px; text-align: center;">Or copy this link: ${assessmentLink}</p>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px;">
          © 2026 Sayraa AI HR Workforce. All rights reserved.
        </div>
      </div>
    </div>
  `;

  return await sendEmail({ to: candidateEmail, subject, html });
};

const sendInterviewInvite = async (candidateEmail, candidateName, jobTitle, appId, candidateId, jobId) => {
  const subject = `AI Video Interview Invitation - ${jobTitle}`;
  const interviewLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/interview?applicationId=${appId}&candidateId=${candidateId}&jobId=${jobId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #2E0854; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">SAYRAA AI HR</h1>
        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">AI Interview Invitation</p>
      </div>
      <div style="background: #f8f9fa; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e9ecef;">
        <h2 style="color: #2E0854; margin-top: 0;">Hi ${candidateName},</h2>
        <p style="color: #495057; line-height: 1.6;">Congratulations! You have been selected for an AI-powered video interview for the <strong>${jobTitle}</strong> position.</p>
        <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #e9ecef;">
          <h3 style="color: #2E0854; margin-top: 0; font-size: 16px;">Interview Details</h3>
          <p style="margin: 8px 0; color: #495057;"><strong>Position:</strong> ${jobTitle}</p>
          <p style="margin: 8px 0; color: #495057;"><strong>Format:</strong> AI-led video interview</p>
          <p style="margin: 8px 0; color: #495057;"><strong>Duration:</strong> 15-20 minutes</p>
          <p style="margin: 8px 0; color: #495057;"><strong>Link Valid:</strong> 72 hours</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${interviewLink}" style="background: #059669; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">Start AI Interview</a>
        </div>
        <p style="color: #6c757d; font-size: 13px; text-align: center;">Or copy this link: ${interviewLink}</p>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px;">
          © 2026 Sayraa AI HR Workforce. All rights reserved.
        </div>
      </div>
    </div>
  `;

  return await sendEmail({ to: candidateEmail, subject, html });
};

const sendOfferLetter = async (candidateEmail, candidateName, jobTitle, department, startDate, appId) => {
  const subject = `Job Offer - ${jobTitle}`;
  const offerLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/offer?appId=${appId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #2E0854; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">SAYRAA AI HR</h1>
        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Offer Letter</p>
      </div>
      <div style="background: #f8f9fa; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e9ecef;">
        <h2 style="color: #2E0854; margin-top: 0;">Dear ${candidateName},</h2>
        <p style="color: #495057; line-height: 1.6;">We are pleased to extend an offer for the position of <strong>${jobTitle}</strong> at Sayraa Technologies.</p>
        <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #e9ecef;">
          <h3 style="color: #2E0854; margin-top: 0; font-size: 16px;">Offer Summary</h3>
          <p style="margin: 8px 0; color: #495057;"><strong>Candidate:</strong> ${candidateName}</p>
          <p style="margin: 8px 0; color: #495057;"><strong>Role:</strong> ${jobTitle}</p>
          <p style="margin: 8px 0; color: #495057;"><strong>Department:</strong> ${department || 'Engineering'}</p>
          <p style="margin: 8px 0; color: #495057;"><strong>Start Date:</strong> ${startDate || 'To be confirmed'}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${offerLink}" style="background: #059669; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">Accept Offer</a>
        </div>
        <p style="color: #6c757d; font-size: 13px; text-align: center;">Or copy this link: ${offerLink}</p>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px;">
          © 2026 Sayraa AI HR Workforce. All rights reserved.
        </div>
      </div>
    </div>
  `;

  return await sendEmail({ to: candidateEmail, subject, html });
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendAssessmentInvite,
  sendInterviewInvite,
  sendOfferLetter
};
