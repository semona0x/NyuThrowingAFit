
-- Create community_fits table
CREATE TABLE IF NOT EXISTS community_fits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_handle TEXT,
  image_urls TEXT NOT NULL DEFAULT '[]',
  caption TEXT NOT NULL,
  approved INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_handle for faster queries
CREATE INDEX IF NOT EXISTS idx_community_fits_user_handle ON community_fits(user_handle);

-- Create index on approved status for filtering approved posts
CREATE INDEX IF NOT EXISTS idx_community_fits_approved ON community_fits(approved);
