CREATE TABLE IF NOT EXISTS questions_ending (
    id_question_ending SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    question VARCHAR(255) NOT NULL,
    number INTEGER NOT NULL
);

CREATE TRIGGER questions_ending_updated_at
BEFORE UPDATE ON questions_ending
FOR EACH ROW
EXECUTE FUNCTION updated_at();

INSERT INTO questions_ending (question, number) VALUES ('De quel anime vient cet ending ?', 1);
INSERT INTO questions_ending (question, number) VALUES ('Quel est le numéro de cet ending ?', 2);