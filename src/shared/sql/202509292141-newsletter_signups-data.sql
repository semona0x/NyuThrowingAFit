
-- Create newsletter_signups table
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uniqueness_check TEXT UNIQUE NOT NULL,
  form_data TEXT NOT NULL,
  notification_email_sent INTEGER DEFAULT 0,
  reply_email_sent INTEGER DEFAULT 0,
  email_sent_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
