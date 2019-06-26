CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);