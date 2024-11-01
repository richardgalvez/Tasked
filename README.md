# Tasked

Task management made simple.

Testing:

Use in PostgreSQL to create tasks table:

CREATE TABLE tasks (
    id UUID NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(255),
    due_date DATE,
    created_date DATE,
    is_done BOOLEAN NOT NULL DEFAULT FALSE
);
