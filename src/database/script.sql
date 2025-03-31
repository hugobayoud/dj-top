-- Create the DJs table
CREATE TABLE djs (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    instagram_url TEXT,
    facebook_url TEXT,
    website_url TEXT,
    youtube_url TEXT,
    photo TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'STAND_BY' CHECK (status IN ('STAND_BY', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on the status column for faster queries
CREATE INDEX idx_djs_status ON djs(status);