const pool = require('./index.js');
const Promise = require("bluebird");
const db = Promise.promisifyAll(pool, { multiArgs: true });

module.exports = {

  getQuestions: (prodId) => {
    const query =
    `SELECT product_id,
     jsonb_agg(json_build_object(
      'question_id',questions.id,
      'question_body',questions.body,
      'question_date',questions.date_written,
      'asker_name', questions.asker_name,
      'question_helpfullness', questions.helpful,
      'reported', questions.reported,
      'answers', (
        SELECT COALESCE(
          json_object_agg(
            answers.id, (
              json_build_object(
                'id', answers.id,
                'body', answers.body,
                'date', answers.date_written,
                'answerer_name', answers.answerer_name,
                'helpfulness', answers.helpful,
                'photos', (
                  SELECT COALESCE (
                    json_agg(
                      url
                    )
                    ,'[]'::json)
                    FROM photos WHERE photos.answer_id = answers.id
                )
              )
            )
          )
          ,'{}'::json)
          FROM answers WHERE answers.question_id = questions.id
      )
    )) AS results
    FROM questions WHERE product_id = $1 AND reported = false
    GROUP BY product_id`;

    return pool.query(query, prodId);
  },


  getAnswers: (vals) => {
    const query =
    `SELECT answers.question_id AS question,
     COALESCE(
      json_agg(
        json_build_object(
          'answer_id', answers.id,
          'body', answers.body,
          'date', answers.date_written,
          'helpfulness', answers.helpful,
          'photos', (
            SELECT COALESCE(
             json_agg(
                json_build_object(
                  'id', photos.id,
                  'url', photos.url
                )
              )
            ,'[]'::json)
            FROM photos WHERE photos.answer_id = answers.id
            LIMIT $2
          )
        )
        ORDER BY answers.id DESC
      )
     , '[]'::json) AS results
     FROM answers WHERE answers.question_id= $1 AND answers.reported = false
     GROUP BY answers.question_id
     LIMIT $2`;
    return pool.query(query, vals);

  },

  postQuestion: (vals) => {
    const query =
    `INSERT INTO questions
     (body, asker_name, asker_email, product_id, date_written)
     VALUES ($1,$2,$3,$4,current_timestamp)`;

    return pool.query(query, vals);
  },

  postAnswer: (vals) => {
    const query =
    `WITH answer_insert AS (
      INSERT INTO answers (question_id, body, answerer_name, answerer_email)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    )
     INSERT INTO photos (url, answer_id)
     VALUES (regexp_split_to_table($5, E'\\,+'), (SELECT id FROM answer_insert))`;

     return pool.query(query, vals)
  },

  markQHelpful: (vals) => {
    const query =
    `UPDATE questions
     SET helpful = helpful+1
     WHERE id = $1`;

     return pool.query(query, vals)
  },

  markAHelpful: (vals) => {
    const query =
    `UPDATE answers
     SET helpful = helpful+1
     WHERE id = $1`;

     return pool.query(query, vals)
  },

  reportQuestion: (vals) => {
    const query =
    `UPDATE questions
     SET reported = true
     WHERE id = $1
    `;
    return pool.query(query, vals)
  },


  reportAnswer: (vals) => {
    const query =
    `UPDATE answers
     SET reported = true
     WHERE id = $1
    `;
    return pool.query(query, vals)
  }


}