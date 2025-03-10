CREATE TABLE IF NOT EXISTS users_networks (
    id_user INTEGER NOT NULL,
    id_network INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    value VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_user, id_network),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_network) REFERENCES networks(id_network)
);

CREATE TRIGGER users_networks_updated_at
BEFORE UPDATE ON users_networks
FOR EACH ROW
EXECUTE FUNCTION updated_at();