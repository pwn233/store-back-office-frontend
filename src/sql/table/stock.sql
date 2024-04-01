CREATE TABLE IF NOT EXISTS store_backoffice.stock (
    id varchar(255) NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    amount INT NOT NULL,
    price DOUBLE NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP NOT null,
    updated_by TEXT DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;