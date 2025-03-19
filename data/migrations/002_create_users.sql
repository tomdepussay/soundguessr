CREATE TABLE IF NOT EXISTS users (
    id_user SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    id_role INTEGER NOT NULL DEFAULT 4,
    id_picture INTEGER,
    FOREIGN KEY (id_role) REFERENCES roles(id_role)
);

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION updated_at();

INSERT INTO users (username, email, password, id_role) VALUES ('admin', 'admin@gmail.com', '$2b$12$CVie7NnR/WIDx/.g07eyK.0f9urFfDJYPIfzN3ct6El4231DX/y6K', 1);