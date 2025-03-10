CREATE TABLE IF NOT EXISTS ending (
    id_ending SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    name VARCHAR(255) NOT NULL,
    number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    id_anime INTEGER NOT NULL,
    id_sound INTEGER NOT NULL,
    id_season INTEGER NOT NULL,
    FOREIGN KEY (id_anime) REFERENCES animes(id_anime),
    FOREIGN KEY (id_sound) REFERENCES sounds(id_sound),
    FOREIGN KEY (id_season) REFERENCES seasons(id_season)
);

CREATE TRIGGER ending_updated_at
BEFORE UPDATE ON ending
FOR EACH ROW
EXECUTE FUNCTION updated_at();