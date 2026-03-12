-- Create authenticated users table
CREATE TABLE IF NOT EXISTS authenticated (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE authenticated ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to read their own data
CREATE POLICY "Users can read own data" 
ON authenticated FOR SELECT 
USING (auth.uid()::text = id::text OR is_admin = true);

-- Insert example admin user
-- Email: admin@olmbach.fr
-- Password: Admin123! (hashed using bcrypt: $2a$10$...)
-- For demo, we'll store plain password but note this should NEVER be done in production
INSERT INTO authenticated (email, password_hash, full_name, is_admin)
VALUES ('admin@olmbach.fr', 'Admin123!', 'Administrateur OLMBacApp', true)
ON CONFLICT (email) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_authenticated_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_authenticated_updated_at
BEFORE UPDATE ON authenticated
FOR EACH ROW
EXECUTE FUNCTION update_authenticated_updated_at();
