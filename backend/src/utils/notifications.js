const { query } = require('../config/db');

/**
 * Creates a notification record and prepares payloads for external gateways
 * (Email / WhatsApp Business API / SMS)
 */
async function createNotification({ type, title, message, link = null, data = null, channel = 'in_app' }) {
  try {
    const res = await query(
      `INSERT INTO sid_notifications (type, title, message, link, data, channel, is_read)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [type, title, message, link, data ? JSON.stringify(data) : null, channel]
    );

    // Logging for external integration (ready for SMTP, Twilio, WhatsApp Cloud API)
    if (channel !== 'in_app') {
      console.log(`[EXTERNAL DISPATCH][${channel.toUpperCase()}] ${title}: ${message}`);
    }

    return res.insertId;
  } catch (err) {
    console.error('Failed to create notification:', err);
    return null;
  }
}

module.exports = { createNotification };
