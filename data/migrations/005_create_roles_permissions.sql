CREATE TABLE IF NOT EXISTS roles_permissions (
    id_role INTEGER NOT NULL,
    id_permission INTEGER NOT NULL,
    PRIMARY KEY (id_role, id_permission),
    FOREIGN KEY (id_role) REFERENCES roles(id_role),
    FOREIGN KEY (id_permission) REFERENCES permissions(id_permission)
);