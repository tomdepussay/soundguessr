CREATE TABLE IF NOT EXISTS questions_opening (
    id_question_opening SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    question VARCHAR(255) NOT NULL,
    number INTEGER NOT NULL
);

CREATE TRIGGER questions_opening_updated_at
BEFORE UPDATE ON questions_opening
FOR EACH ROW
EXECUTE FUNCTION updated_at();

INSERT INTO questions_opening (question, number) VALUES ('De quel anime vient cet opening ?', 1);
INSERT INTO questions_opening (question, number) VALUES ('Quel est le numéro de cet opening ?', 2);
INSERT INTO questions_opening (question, number) VALUES ('Quel est le titre de cet opening ?', 3);