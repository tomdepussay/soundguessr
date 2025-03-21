CREATE TABLE IF NOT EXISTS networks (
    id_network SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    name VARCHAR(255) NOT NULL,
    extension VARCHAR(5) NOT NULL,
    size INTEGER NOT NULL
);

CREATE TRIGGER networks_updated_at
BEFORE UPDATE ON networks
FOR EACH ROW
EXECUTE FUNCTION updated_at();