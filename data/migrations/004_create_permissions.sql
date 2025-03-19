CREATE TABLE IF NOT EXISTS permissions (
    id_permission SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TRIGGER permissions_updated_at
BEFORE UPDATE ON permissions
FOR EACH ROW
EXECUTE FUNCTION updated_at();

INSERT INTO permissions (name, description) VALUES ('admin', 'Accès administrateur');

INSERT INTO permissions (name, description) VALUES ('admin.rights', 'Accès à la gestion des droits');

INSERT INTO permissions (name, description) VALUES ('admin.rights.permissions', 'Accès à la gestion des permissions');
INSERT INTO permissions (name, description) VALUES ('admin.rights.permissions.name', 'Voir le nom des permissions');
INSERT INTO permissions (name, description) VALUES ('admin.rights.permissions.description', 'Voir la description des permissions');
INSERT INTO permissions (name, description) VALUES ('admin.rights.permissions.add', 'Ajouter une permission');
INSERT INTO permissions (name, description) VALUES ('admin.rights.permissions.edit', 'Modifier une permission');
INSERT INTO permissions (name, description) VALUES ('admin.rights.permissions.delete', 'Supprimer une permission');

INSERT INTO permissions (name, description) VALUES ('admin.rights.roles', 'Accès à la gestion des rôles');
INSERT INTO permissions (name, description) VALUES ('admin.rights.roles.name', 'Voir le noms des rôles');
INSERT INTO permissions (name, description) VALUES ('admin.rights.roles.add', 'Ajouter un rôle');
INSERT INTO permissions (name, description) VALUES ('admin.rights.roles.edit', 'Modifier un rôle');
INSERT INTO permissions (name, description) VALUES ('admin.rights.roles.delete', 'Supprimer un rôle');