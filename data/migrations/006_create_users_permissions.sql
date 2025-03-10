CREATE TABLE IF NOT EXISTS users_permissions (
    id_user INTEGER NOT NULL,
    id_permission INTEGER NOT NULL,
    PRIMARY KEY (id_user, id_permission),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_permission) REFERENCES permissions(id_permission)
);