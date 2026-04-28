-- migration: add balance_hue to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS balance_hue NUMERIC DEFAULT 0;
