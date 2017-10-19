CREATE TABLE IF NOT EXISTS orders
(
    id serial NOT NULL,
    exchange_contract text NOT NULL,
    expiration_time bigint NOT NULL,
    fee_recipient text,

    maker text NOT NULL,
    maker_fee bigint,
    maker_token_address text NOT NULL,
    maker_token_value text NOT NULL,

    taker text NOT NULL,
    taker_fee bigint,
    taker_token_address text NOT NULL,
    taker_token_value text NOT NULL,

    salt text NOT NULL,
    status text NOT NULL,

    signature_v integer NOT NULL,
    signature_s text NOT NULL,
    signature_r text NOT NULL,

    hash text UNIQUE NOT NULL,
    PRIMARY KEY (id)
);