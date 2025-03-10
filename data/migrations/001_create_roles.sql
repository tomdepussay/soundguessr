CREATE TABLE IF NOT EXISTS roles (
    id_role SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL
);

CREATE TRIGGER roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION updated_at();

INSERT INTO roles (name) VALUES ('Administrateur');
INSERT INTO roles (name) VALUES ('Modérateur');
INSERT INTO roles (name) VALUES ('Observateur');
INSERT INTO roles (name) VALUES ('Utilisateur');