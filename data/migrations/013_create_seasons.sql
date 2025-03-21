CREATE TABLE IF NOT EXISTS seasons (
    id_season SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL
);

CREATE TRIGGER seasons_updated_at
BEFORE UPDATE ON seasons
FOR EACH ROW
EXECUTE FUNCTION updated_at();