const pool = require('./index.js');
const Promise = require("bluebird");
const db = Promise.promisifyAll(pool, { multiArgs: true });

module.exports = {

  getQuestions: (val) => {
    // only want answers and questions that are NOT reported
    // var query = `SELECT product_id,
    // jsonb_agg(json_build_object(
    //   'question_id',questions.id,
    //   'question_body',questions.body,
    //   'question_date',questions.date_written,
    //   'asker_name', questions.asker_name,
    //   'question_helpfullness', questions.helpful,
    //   'reported', questions.reported,
    //   'answers', json_build_object(
    //     (SELECT answers.id FROM answers WHERE answers.question_id = (SELECT questions.id FROM questions WHERE questions.product_id = $1)) ,'test')
    // )) AS results
    // FROM questions WHERE product_id = $1 AND reported = false
    // GROUP BY product_id`

    // if there are answers, create an object for them with answer_id : {}
    // if not, default = {}

    var query = `SELECT product_id,
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

              )
            )
          ),
          '{}'::json)
          FROM answers WHERE answers.question_id = questions.id
      )
    )) AS results
    FROM questions WHERE product_id = $1 AND reported = false
    GROUP BY product_id`

    return pool.query(query, val);
  },

  // SELECT * FROM ANSWERS WHERE question_id = id AND reported = false
  // JOIN with photos where answer_id = (answer_id WHERE question_id = id)
  getAnswers: () => {

  },


  // INSERT <questionParams> INTO questions
  postQuestion: () => {

  },

  // INSERT <answer> INTO answers WHERE question_id = (? question_id param)
  // INSERT <photo> INTO photos WHERE answer_id = (SELECT question_id FROM answeres WHERE question_id = questionIdParam)
  postAnswer: () => {

  },

  // might need to retrieve helpful/reported states first...

  // UPDATE questions SET helpful = (!helpful) WHERE question_id = (questionIdParam)
  markQHelpful: () => {

  },

  // UPDATE questions SET reported = (!reported) WHERE question_id = (questionIdParam)
  reportQuestion: () => {

  },

  markAHelpful: () => {

  },

  reportAnswer: () => {

  }


}