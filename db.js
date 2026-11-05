const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, 'rsvps.db');
const db = new DatabaseSync(dbPath);

// Initialize table 'rsvps'
db.exec(`
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_name TEXT NOT NULL,
    attendance_status TEXT NOT NULL,
    stay_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log(`[Database] SQLite database initialized at ${dbPath} with table 'rsvps'.`);

function insertRsvp(guestName, attendanceStatus, stayType = null) {
  const stmt = db.prepare(`
    INSERT INTO rsvps (guest_name, attendance_status, stay_type, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `);
  const result = stmt.run(guestName, attendanceStatus, stayType);
  return {
    id: result.lastInsertRowid,
    guest_name: guestName,
    attendance_status: attendanceStatus,
    stay_type: stayType
  };
}

function getAllRsvps() {
  const stmt = db.prepare(`SELECT * FROM rsvps ORDER BY id DESC`);
  return stmt.all();
}

function getRsvpStats() {
  const totalStmt = db.prepare(`SELECT COUNT(*) as count FROM rsvps`);
  const attendingStmt = db.prepare(`SELECT COUNT(*) as count FROM rsvps WHERE attendance_status = 'Attending'`);
  const declinedStmt = db.prepare(`SELECT COUNT(*) as count FROM rsvps WHERE attendance_status = 'Declined'`);
  const nightOnlyStmt = db.prepare(`SELECT COUNT(*) as count FROM rsvps WHERE attendance_status = 'Attending' AND stay_type LIKE '%Night Only%'`);
  const overnightStmt = db.prepare(`SELECT COUNT(*) as count FROM rsvps WHERE attendance_status = 'Attending' AND stay_type LIKE '%Overnight%'`);

  return {
    total: totalStmt.get().count,
    attending: attendingStmt.get().count,
    declined: declinedStmt.get().count,
    nightOnly: nightOnlyStmt.get().count,
    overnight: overnightStmt.get().count
  };
}

module.exports = {
  db,
  insertRsvp,
  getAllRsvps,
  getRsvpStats
};
