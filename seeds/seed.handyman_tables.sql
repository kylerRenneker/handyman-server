BEGIN;

    TRUNCATE
provider_reviews,
provider_services,
providers,
quote_requests,
users
RESTART iDENTITY CASCADE;

INSERT INTO users
    (user_name, full_name, password, email)
VALUES
    ('b.deboop', 'Bodeep Deboop', '$2a$12$SCfOuxmu/ojGGYEBYI3ffuiL7c3wcEKsUr0XFJI0HFJtyI4AjmysG', 'BodeepBop@gmail.com'),
    ('c.bloggs', 'Charlie Bloggs', '$2a$12$kKZsbpYrgJX5VFh441Seauhm5jyR2BiEVwtFojkIqcZnIzgq3gjr.', 'CharlieBloggs@gmail.com'),
    ('s.smith', 'Sam Smith', '$2a$12$E6Hjnb5LAs0pgNoL2hG5w.l4SyOeSQLvnfo9XJ037thKNlL2IUaBq', 'SamSmith@gmail.com'),
    ('lexlor', 'Alex Taylor', '$2a$12$Udla8nLnCR04aCKJXbmfVuUkW0D5NOd9WnJ2wGvPfjKqy7rfkYk8u', 'lexTaylor@aol.com'),
    ('wippy', 'Ping Won In', '$2a$12$kZ8EAoj.MQXxNVOzz1JAke8RpiEY9nqETIlJFXXpLj01irPLPawDi', 'wippyWonIn@yahoo.com');

INSERT INTO providers
    (user_id, provider_name, introduction, services, location)
VALUES
    (2, 'Blogg''s Fixin Mixin', 'I have been in the handyman business for 30 years. Enough Said.', '{1, 4}', '33410'),
    (4, 'Lex''s Leak Solutions', 'I have been in the handyman business for 22 years. If it leaks, I can fix it. Enough Said.', '{2}', '32541');

INSERT INTO provider_services
    (name)
VALUES
    ('Appliance Installation & Repair'),
    ('Minor Plumbing Leaks'),
    ('Electrical'),
    ('Carpentry & Trim'),
    ('Water Damage Restoration'),
    ('Drywall Installation & Repair'),
    ('Professional Painting'),
    ('Framing'),
    ('Door Installation & Repair'),
    ('Attic Insulation'),
    ('Cabinet Installation $ Repair'),
    ('TV Mounting'),
    ('Caulking'),
    ('Toilet Repair & Installation'),
    ('Tile Installation & Repair'),
    ('Cleaning Services'),
    ('Lawn Work & Yard Cleanup');

INSERT INTO provider_reviews
    (text, rating, provider_id, user_id)
VALUES
    ('Charlie did an awesome job installing my kitchen appliances!', 5, 1, 5),
    ('Lex fixed my pesky sink link in no time!', 4, 2, 1);

INSERT INTO quote_requests
    (provider_id, user_id, location, services, email, description)
VALUES
    (1, 5, '33410', 1, 'wippyWonIn@yahoo.com', 'I need my kitchen applainces to be installed.'),
    (2, 1, '32541', 2, 'BodeepBop@gmail.com', 'Pesky sink leak needs repair!');

COMMIT;

