require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { insertRsvp, getAllRsvps, getRsvpStats } = require('./db');
const { sendRsvpNotification } = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;

// RSVP Deadline: November 12, 2026 23:59:59 PHT (UTC+8)
const RSVP_DEADLINE_MS = new Date('2026-11-12T23:59:59+08:00').getTime();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Check deadline status endpoint
app.get('/api/deadline-status', (req, res) => {
  const now = Date.now();
  const isClosed = now > RSVP_DEADLINE_MS;
  res.json({
    isClosed,
    deadline: '2026-11-12T23:59:59+08:00',
    eventDate: '2026-11-14T19:00:00+08:00'
  });
});

// Single name validator to strictly enforce "No Plus One" policy
function validateSingleGuestName(name) {
  if (!name || typeof name !== 'string') return { valid: false, reason: 'Guest name is required.' };
  const trimmed = name.trim();
  if (trimmed.length < 2) return { valid: false, reason: 'Please enter your full name.' };

  // Detect plus-one indicators: &, +, and, with, comma, plus one
  const plusOneRegex = /(\band\b|\bwith\b|\bplus\b|\bplus\s*one\b|\b\+1\b|[&+,/])/i;
  if (plusOneRegex.test(trimmed)) {
    return {
      valid: false,
      reason: 'Strict "No Plus One" Rule: Please enter only ONE guest name. Group or couple submissions are not permitted due to venue capacity.'
    };
  }

  return { valid: true, cleanName: trimmed };
}

// POST /api/rsvp - Submit RSVP
app.post('/api/rsvp', async (req, res) => {
  try {
    const now = Date.now();
    if (now > RSVP_DEADLINE_MS) {
      return res.status(403).json({
        success: false,
        error: 'RSVP submissions closed on November 12, 2026. Submissions are no longer accepted.'
      });
    }

    const { guest_name, attendance_status, stay_type } = req.body;

    // Validate single guest name
    const nameValidation = validateSingleGuestName(guest_name);
    if (!nameValidation.valid) {
      return res.status(400).json({ success: false, error: nameValidation.reason });
    }

    // Validate attendance status
    if (!attendance_status || !['Attending', 'Declined'].includes(attendance_status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid attendance status. Please choose Attending or Declined.'
      });
    }

    // Validate stay type if attending
    let finalStayType = null;
    if (attendance_status === 'Attending') {
      if (!stay_type || !['Night Only', 'Overnight'].includes(stay_type)) {
        return res.status(400).json({
          success: false,
          error: 'Please choose your stay preference (Night Only or Overnight).'
        });
      }
      finalStayType = stay_type;
    }

    // Save to database table 'rsvps'
    const newRecord = insertRsvp(nameValidation.cleanName, attendance_status, finalStayType);
    console.log(`[RSVP Received] Saved ID #${newRecord.id}: ${newRecord.guest_name} -> ${newRecord.attendance_status} (${newRecord.stay_type || 'N/A'})`);

    // Trigger immediate email notification to shkdhanalumboy2019@gmail.com
    let emailResult = null;
    try {
      emailResult = await sendRsvpNotification({
        guestName: newRecord.guest_name,
        attendanceStatus: newRecord.attendance_status,
        stayType: newRecord.stay_type
      });
    } catch (emailErr) {
      console.error('[RSVP Email Trigger Error]', emailErr);
    }

    return res.status(200).json({
      success: true,
      message: attendance_status === 'Attending'
        ? `Thank you, ${newRecord.guest_name}! Your RSVP has been confirmed. We can't wait to celebrate with you!`
        : `Thank you, ${newRecord.guest_name}. Your response has been noted. You will be missed!`,
      rsvp: newRecord,
      notification: emailResult
    });
  } catch (err) {
    console.error('Server error handling RSVP:', err);
    return res.status(500).json({ success: false, error: 'Internal server error processing RSVP.' });
  }
});

// GET /api/rsvps - List all RSVPs (Admin / Debutante overview)
app.get('/api/rsvps', (req, res) => {
  try {
    const list = getAllRsvps();
    const stats = getRsvpStats();
    res.json({ success: true, stats, list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`✨ 18th Debut Invitation Server running at http://localhost:${PORT}`);
  console.log(`📅 Target Event Date: November 14, 2026 6:00:00 PM`);
  console.log(`⏰ RSVP Deadline: November 12, 2026 23:59:59`);
});
