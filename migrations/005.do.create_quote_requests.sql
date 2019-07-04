CREATE TABLE quote_requests
(
    id SERIAL PRIMARY KEY,
    provider_id INTEGER REFERENCES providers(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    location TEXT NOT NULL,
    services INTEGER
    [],
    email TEXT NOT NULL,
    description TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now
    () NOT NULL
);