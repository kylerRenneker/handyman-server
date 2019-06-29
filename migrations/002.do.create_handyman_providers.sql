CREATE TABLE providers
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    provider_name TEXT NOT NULL,
    introduction TEXT NOT NULL,
    services INTEGER
    [],
    location TEXT NOT NULL,
    quote_Requests INTEGER []
);