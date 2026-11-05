const { insertRsvp } = require('../db');
const { sendRsvpNotification } = require('../mailer');

module.exports = async (req, res) => {
  // RSVP Deadline: November 12, 2026 23:59:59 PHT (UTC+8)
  const RSVP_DEADLINE_MS = new Date('2026-11-12T23:59:59+08:00').getTime();
  if (Date.now() > RSVP_DEADLINE_MS) {
    return res.status(403).json({
      success: false,
      error: 'RSVP submissions closed on November 12, 2026.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { guest_name, attendance_status, stay_type } = req.body;

  if (!guest_name || typeof guest_name !== 'string' || guest_name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Please enter your full name.' });
  }

  // Enforce single name
  const plusOneRegex = /(\band\b|\bwith\b|\bplus\b|\bplus\s*one\b|\b\+1\b|[&+,/])/i;
  if (plusOneRegex.test(guest_name.trim())) {
    return res.status(400).json({
      success: false,
      error: 'Strict "No Plus One" Rule: Please enter only ONE guest name.'
    });
  }

  if (!['Attending', 'Declined'].includes(attendance_status)) {
    return res.status(400).json({ success: false, error: 'Invalid attendance status.' });
  }

  let finalStayType = null;
  if (attendance_status === 'Attending') {
    if (!stay_type || !['Night Only', 'Overnight'].includes(stay_type)) {
      return res.status(400).json({ success: false, error: 'Please select stay preference.' });
    }
    finalStayType = stay_type;
  }

  try {
    const record = insertRsvp(guest_name.trim(), attendance_status, finalStayType);
    await sendRsvpNotification({
      guestName: record.guest_name,
      attendanceStatus: record.attendance_status,
      stayType: record.stay_type
    });

    return res.status(200).json({
      success: true,
      message: 'RSVP confirmed successfully!',
      rsvp: record
    });
  } catch (err) {
    console.error('Error saving RSVP:', err);
    return res.status(500).json({ success: false, error: 'Failed to record RSVP.' });
  }
};
