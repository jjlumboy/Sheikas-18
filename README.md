# Sheika's 18th Birthday Debut Invitation Website 🥂✨

A sleek, casual yet elegant mobile-first web application for an 18th Birthday Debut, built with a luxurious dark mode palette: **Midnight Black**, **Crisp Silver**, and **Rich Wine Red (Burgundy)** with metallic accents.

---

## 🌟 Key Features

1. **Theme & Styling**:
   - Midnight Black background (`#08080B`) with deep burgundy radial gradients.
   - Rich Wine Red (`#721224`) & metallic gold/champagne accents (`#C5A059`).
   - Mobile-first typography using *Cinzel* luxury serif and *Plus Jakarta Sans*.

2. **Top Live Countdown Timer**:
   - Pinned at the very top of the webpage.
   - Live tick down to **November 14, 2026 19:00:00 (PHT / UTC+8)**.
   - Shows Days, Hours, Minutes, and Seconds with glowing metallic bordered cards.

3. **Background Music & Floating Vinyl Disc**:
   - Floating wine-red vinyl record toggle button in the bottom corner with concentric groove rings.
   - Continuously spins when music plays; pauses on click.
   - **Mobile Autoplay Compliance**: Starts automatically on the guest's very first tap/touch anywhere on screen.
   - Includes instrumental audio (`audio/beauty-and-the-beast-instrumental.mp3`) with cloud fallback.

4. **Invitation Details & Venue Notice**:
   - Formal invitation text with celebratory champagne flair.
   - Date: **November 14, 2026** | Time: **6:00 PM** | Venue: **El Pablo**.
   - RSVP Deadline: **November 12, 2026**.
   - Prominent **Strict "No Plus One" Warning Banner** due to venue capacity restrictions.

5. **Debut Program & Entourage Accordions (4 Categories x 18 Slots)**:
   - 🌹 **18 Roses & Dances** (18 numbered slots)
   - 🕯️ **18 Gifts** (18 numbered slots)
   - 💵 **18 Bills** (18 numbered slots)
   - 🥃 **18 Shots** (18 numbered slots)
   - Edit names anytime directly inside [`public/entourage.json`](public/entourage.json).

6. **Streamlined RSVP Form & SQLite Database**:
   - Strictly collects **only**: Guest Name and Attendance Status (*Attending* vs *Declined*).
   - **Conditional Stay Box**: When *Attending* is selected, displays options for **Night Only** vs **Overnight Stay**.
   - **Strict Single Guest Validation**: Rejects multiple names, `and`, `&`, `+`, `plus one` to enforce venue capacity rules.
   - Programmatically disabled after **November 12, 2026 23:59:59**.
   - Database table: `rsvps` in SQLite `rsvps.db`.
   - Celebratory confetti burst upon RSVP confirmation.

7. **Instant Email Notifications**:
   - Triggers an immediate email alert to **`shkdhanalumboy2019@gmail.com`** upon every submission.
   - Exact format:
     `"New RSVP! [Guest Name] has responded: [Attending/Declined] Attending: [Night/Overnight]."`

8. **RSVP Admin Dashboard**:
   - Live dashboard at `http://localhost:3000/admin.html`.
   - Real-time guest counter, Attending / Declined breakdown, Night Only vs Overnight stats, and guest search.

---

## 🚀 Quick Start (Running Locally)

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser:
   - **Invitation Website**: [http://localhost:3000](http://localhost:3000)
   - **RSVP Admin Dashboard**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

## ✉️ Configuring Live Email Dispatch (Gmail SMTP)

By default, the server logs all email alerts to the console and to `emails_sent.log`. To deliver actual emails to `shkdhanalumboy2019@gmail.com`:

1. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   GMAIL_USER=your_gmail_address@gmail.com
   GMAIL_APP_PASSWORD=your_16_char_google_app_password
   ```
2. To get a 16-character Google App Password:
   - Go to your Google Account > **Security** > **2-Step Verification** > **App Passwords**.
   - Generate an app password for "Mail" and paste it into `.env`.
