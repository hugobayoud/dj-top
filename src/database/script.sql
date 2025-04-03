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

-- Create the users table
CREATE TABLE users (
    id TEXT PRIMARY KEY, -- Not UUID because it's from Supabase Auth
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create the user_dj_ratings table
CREATE TABLE user_dj_ratings (
    id UUID PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dj_id UUID NOT NULL REFERENCES djs(id) ON DELETE CASCADE,
    elo_rating INTEGER NOT NULL DEFAULT 1400,
    battles_count INTEGER NOT NULL DEFAULT 0,
    unknown BOOLEAN,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, dj_id)
);

-- Create indexes for user_dj_ratings for faster queries
CREATE INDEX idx_user_dj_ratings_user_id ON user_dj_ratings(user_id);
CREATE INDEX idx_user_dj_ratings_dj_id ON user_dj_ratings(dj_id);
CREATE INDEX idx_user_dj_ratings_elo ON user_dj_ratings(elo_rating DESC);

-- Create the global_rankings table
CREATE TABLE global_rankings (
    dj_id UUID PRIMARY KEY REFERENCES djs(id) ON DELETE CASCADE,
    average_elo_rating NUMERIC(10, 2) NOT NULL DEFAULT 1400.00,
    total_battles INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on global_rankings for faster sorting
CREATE INDEX idx_global_rankings_rating ON global_rankings(average_elo_rating DESC);

-- Add triggers to update last_updated timestamp automatically
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_dj_ratings_last_updated
BEFORE UPDATE ON user_dj_ratings
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_column();

CREATE TRIGGER update_global_rankings_last_updated
BEFORE UPDATE ON global_rankings
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_column();

-- Function to recalculate global rankings
CREATE OR REPLACE FUNCTION update_global_ranking()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update the global ranking for the affected DJ
    INSERT INTO global_rankings (dj_id, average_elo_rating, total_battles, last_updated)
    SELECT 
        NEW.dj_id, 
        COALESCE(AVG(elo_rating), 1400)::NUMERIC(10,2), 
        COALESCE(SUM(battles_count), 0), 
        NOW()
    FROM user_dj_ratings
    WHERE dj_id = NEW.dj_id AND unknown IS NOT TRUE
    ON CONFLICT (dj_id) DO UPDATE SET
        average_elo_rating = EXCLUDED.average_elo_rating,
        total_battles = EXCLUDED.total_battles,
        last_updated = EXCLUDED.last_updated;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for when a user_dj_rating is inserted or updated
CREATE TRIGGER update_global_ranking_after_user_rating_change
AFTER INSERT OR UPDATE ON user_dj_ratings
FOR EACH ROW
EXECUTE FUNCTION update_global_ranking();

-- Trigger for when a user_dj_rating is deleted (optional but complete)
CREATE OR REPLACE FUNCTION update_global_ranking_on_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate for the DJ whose rating was deleted
    INSERT INTO global_rankings (dj_id, average_elo_rating, total_battles, last_updated)
    SELECT 
        OLD.dj_id, 
        COALESCE(AVG(elo_rating), 1400)::NUMERIC(10,2), 
        COALESCE(SUM(battles_count), 0), 
        NOW()
    FROM user_dj_ratings
    WHERE dj_id = OLD.dj_id AND unknown IS NOT TRUE
    ON CONFLICT (dj_id) DO UPDATE SET
        average_elo_rating = EXCLUDED.average_elo_rating,
        total_battles = EXCLUDED.total_battles,
        last_updated = EXCLUDED.last_updated;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_global_ranking_after_user_rating_delete
AFTER DELETE ON user_dj_ratings
FOR EACH ROW
EXECUTE FUNCTION update_global_ranking_on_delete();