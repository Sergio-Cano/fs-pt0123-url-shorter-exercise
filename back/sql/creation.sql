DROP TABLE IF EXISTS users;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS links (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    short_url TEXT NOT NULL UNIQUE,
    origin_url TEXT NOT NULL,
    uses_by_creator INTEGER DEFAULT 0,
    uses INTEGER DEFAULT 0,
    creation_date DATE DEFAULT NOW(),
    created_by uuid,
    CONSTRAINT created_by_user
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
)