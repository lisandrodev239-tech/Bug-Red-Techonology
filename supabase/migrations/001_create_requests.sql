CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  problem TEXT NOT NULL,
  service_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (needed for the public form)
CREATE POLICY "Allow anonymous inserts" ON requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can view requests
CREATE POLICY "Allow authenticated selects" ON requests
  FOR SELECT
  TO authenticated
  USING (true);
