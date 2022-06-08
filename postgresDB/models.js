const db = require('./index.js');

module.exports = {

  // select all questions with product id from query
  // join with all answers with question_id WHERE question_id = product_id
  // AND join with all photos with answer_id WHERE answer_id = (answer_id WHERE question_id = id FROM question)
  getQuestions: () => {
    npx kill-port 3000
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