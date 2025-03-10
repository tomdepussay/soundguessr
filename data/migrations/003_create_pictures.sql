CREATE TABLE IF NOT EXISTS pictures (
    id_picture SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    link VARCHAR(255) NOT NULL,
    extension VARCHAR(5) NOT NULL,
    size INTEGER NOT NULL,
    id_user INTEGER NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id_user)
);

ALTER TABLE users
    ADD FOREIGN KEY (id_picture) REFERENCES pictures(id_picture);