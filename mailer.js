require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const RECIPIENT_EMAIL = 'shkdhanalumboy2019@gmail.com';

// Configure transporter
function createTransporter() {
  // Option 1: Direct SMTP configuration
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Option 2: Gmail service (using Google App Password)
  if (process.env.GMAIL_USER && (process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD)) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  return null;
}

/**
 * Send RSVP Notification Email
 * @param {Object} data
 * @param {string} data.guestName
 * @param {string} data.attendanceStatus - 'Attending' | 'Declined'
 * @param {string} data.stayType - 'Night Only' | 'Overnight' | null
 */
async function sendRsvpNotification({ guestName, attendanceStatus, stayType }) {
  // Normalize stay description for subject line: "Night" or "Overnight"
  let stayLabel = 'N/A';
  if (attendanceStatus === 'Attending') {
    if (stayType && stayType.toLowerCase().includes('overnight')) {
      stayLabel = 'Overnight';
    } else {
      stayLabel = 'Night';
    }
  }

  // The required format:
  // "New RSVP! [Guest Name] has responded: [Attending/Declined] Attending: [Night/Overnight]."
  const subjectLine = `New RSVP! ${guestName} has responded: ${attendanceStatus} Attending: ${stayLabel}.`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0B0B0E; color: #E2E8F0; padding: 24px; margin: 0; }
        .card { max-width: 540px; margin: 0 auto; background: #16161D; border: 1px solid #721224; border-radius: 14px; padding: 28px; box-shadow: 0 8px 30px rgba(114, 18, 36, 0.35); }
        .header { text-align: center; border-bottom: 1px solid #2D2D3A; padding-bottom: 16px; margin-bottom: 20px; }
        .title { color: #F8FAFC; font-size: 22px; font-weight: 700; margin: 0 0 6px 0; }
        .subtitle { color: #C5A059; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; }
        .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 14px; margin: 10px 0; }
        .attending { background: #721224; color: #FFFFFF; }
        .declined { background: #374151; color: #9CA3AF; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #242430; font-size: 15px; }
        .info-label { color: #94A3B8; }
        .info-value { color: #FFFFFF; font-weight: 600; }
        .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #64748B; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="subtitle">Sheika's 18th Debut</div>
          <div class="title">New RSVP Notification 🥂✨</div>
          <div class="badge ${attendanceStatus === 'Attending' ? 'attending' : 'declined'}">
            ${attendanceStatus === 'Attending' ? 'Attending' : 'Declined'}
          </div>
        </div>

        <div class="info-row">
          <span class="info-label">Guest Name:</span>
          <span class="info-value">${guestName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Response:</span>
          <span class="info-value">${attendanceStatus}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Stay Preference:</span>
          <span class="info-value">${stayLabel}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Received At:</span>
          <span class="info-value">${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })} (PHT)</span>
        </div>

        <div class="footer">
          Event: November 14, 2026 6:00 PM | Venue: El Pablo<br>
          Sent automatically from the Debut RSVP System
        </div>
      </div>
    </body>
    </html>
  `;

  const logEntry = `[${new Date().toISOString()}] Subject: ${subjectLine}\nGuest: ${guestName} | Status: ${attendanceStatus} | Stay: ${stayLabel}\n\n`;
  try {
    fs.appendFileSync(path.join(__dirname, 'emails_sent.log'), logEntry);
  } catch (err) {
    console.error('Failed to write to email log:', err);
  }

  const transporter = createTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"Debut RSVP Alert" <${process.env.SMTP_USER || process.env.GMAIL_USER || 'rsvp@debut.local'}>`,
        to: RECIPIENT_EMAIL,
        subject: subjectLine,
        text: subjectLine,
        html: htmlBody
      });
      console.log(`[Email Sent] Message ID: ${info.messageId} to ${RECIPIENT_EMAIL}`);
      return { success: true, messageId: info.messageId, delivered: true };
    } catch (error) {
      console.error('[Email Error] Failed to send via transporter:', error.message);
      return { success: false, error: error.message, logged: true };
    }
  } else {
    console.log(`[Email Simulation] Transporter not configured. Alert logged: "${subjectLine}" to ${RECIPIENT_EMAIL}`);
    return { success: true, delivered: false, simulated: true, log: subjectLine };
  }
}

module.exports = {
  sendRsvpNotification,
  RECIPIENT_EMAIL
};
