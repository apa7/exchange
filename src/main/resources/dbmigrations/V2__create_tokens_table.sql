CREATE TABLE IF NOT EXISTS tokens
(
    id serial NOT NULL,
    address text UNIQUE NOT NULL,
    symbol text UNIQUE NOT NULL,
    PRIMARY KEY (id)
);