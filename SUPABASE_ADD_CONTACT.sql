-- Add contact column to graduates table if it doesn't exist
ALTER TABLE graduates ADD COLUMN IF NOT EXISTS contact TEXT;

-- Optional: Add index for faster contact searches
CREATE INDEX IF NOT EXISTS idx_graduates_contact ON graduates(contact);
