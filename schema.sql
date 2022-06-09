DROP DATABASE IF EXISTS qa WITH (FORCE);
CREATE DATABASE qa;
\c qa;

DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS photos;

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(30),
  body VARCHAR(500) NOT NULL,
  date_written DOUBLE PRECISION,
  asker_name VARCHAR(40) NOT NULL,
  asker_email VARCHAR(40) NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT false,
  helpful INT NOT NULL DEFAULT 0

);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INT NOT NULL,
  body TEXT NOT NULL,
  date_written DOUBLE PRECISION,
  answerer_name VARCHAR(40) NOT NULL,
  answerer_email VARCHAR(40) NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT false,
  helpful INT NOT NULL DEFAULT 0
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  answer_id INT NOT NULL,
  url VARCHAR(200) NOT NULL
);

-- Extract .csv data and load into database
COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) FROM '/Users/kyletran/Desktop/HR/data/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) FROM '/Users/kyletran/Desktop/HR/data/answers.csv'
DELIMITER ','
CSV HEADER;

COPY photos(id, answer_id, url) FROM '/Users/kyletran/Desktop/HR/data/answers_photos.csv'
DELIMITER ','
CSV HEADER;

-- Transform data into expected format:

-- Create temp TIMESTAMP column
ALTER TABLE questions ADD formatted_date TIMESTAMP WITHOUT TIME ZONE NULL;

-- Copy casted value over temporary column
UPDATE questions SET formatted_date = to_timestamp(date_written/1000)::TIMESTAMP;

-- Modify original column with temp column
ALTER TABLE questions ALTER COLUMN date_written TYPE TIMESTAMP WITHOUT TIME ZONE USING formatted_date;

-- Drop temporary column
ALTER TABLE questions DROP COLUMN formatted_date;


ALTER TABLE answers ADD formatted_date TIMESTAMP WITHOUT TIME ZONE NULL;
UPDATE answers SET formatted_date = to_timestamp(date_written/1000)::TIMESTAMP;
ALTER TABLE answers ALTER COLUMN date_written TYPE TIMESTAMP WITHOUT TIME ZONE USING formatted_date;
ALTER TABLE answers DROP COLUMN formatted_date;

create index product_id ON questions(product_id);
create index question_id ON answers(question_id);
create index answer_id ON photos(answer_id);