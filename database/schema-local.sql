-- Company Calendar Platform Database Schema (Local PostgreSQL Version)
-- This file contains the SQL schema for local PostgreSQL setup
-- RLS policies have been removed as they depend on Supabase Auth

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL CHECK (length(name) >= 2),
    shareable_url VARCHAR(200) NOT NULL UNIQUE CHECK (length(shareable_url) >= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE CHECK (length(username) >= 3),
    password_hash VARCHAR(255) NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL CHECK (length(title) >= 3),
    description TEXT NOT NULL CHECK (length(description) >= 10),
    start_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(200),
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_event_times CHECK (start_date_time < end_date_time)
);

-- Widget configurations table
CREATE TABLE IF NOT EXISTS widget_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,
    theme VARCHAR(10) NOT NULL CHECK (theme IN ('light', 'dark', 'auto')),
    primary_color VARCHAR(7) NOT NULL CHECK (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
    show_upcoming_only BOOLEAN NOT NULL DEFAULT true,
    max_events INTEGER NOT NULL DEFAULT 10 CHECK (max_events >= 1 AND max_events <= 100),
    date_format VARCHAR(20) NOT NULL CHECK (date_format IN ('YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY', 'MMM DD, YYYY')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_events_company_id ON events(company_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date_time);
CREATE INDEX IF NOT EXISTS idx_events_public ON events(is_public);
CREATE INDEX IF NOT EXISTS idx_companies_shareable_url ON companies(shareable_url);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at timestamps
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widget_configs_updated_at BEFORE UPDATE ON widget_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- NOTE: Row Level Security (RLS) policies have been removed for local development
-- The original schema included RLS policies that depend on auth.uid() from Supabase Auth
-- Since we're using local PostgreSQL without Supabase Auth, these policies are not applicable
-- Authorization is enforced at the application level through JWT-based authentication

-- Comments for documentation
COMMENT ON TABLE companies IS 'Stores company information and shareable URL mappings';
COMMENT ON TABLE users IS 'Stores user authentication data and company associations';
COMMENT ON TABLE events IS 'Stores calendar events with scheduling and visibility information';
COMMENT ON TABLE widget_configs IS 'Stores widget customization settings for each company';

COMMENT ON COLUMN companies.shareable_url IS 'Unique URL identifier for public calendar access';
COMMENT ON COLUMN events.is_public IS 'Determines if event is visible in public calendar feeds';
COMMENT ON COLUMN widget_configs.theme IS 'Widget color theme: light, dark, or auto';
COMMENT ON COLUMN widget_configs.primary_color IS 'Hex color code for widget primary color';
COMMENT ON COLUMN widget_configs.show_upcoming_only IS 'Whether to show only future events in widget';
COMMENT ON COLUMN widget_configs.max_events IS 'Maximum number of events to display in widget';
COMMENT ON COLUMN widget_configs.date_format IS 'Date format string for widget event display';
