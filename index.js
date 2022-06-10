const express = require('express');
const pool = require('./postgresDB/index.js');
const models = require('./postgresDB/models.js');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

// ROUTES:

// get all questions
app.get('/qa/questions', (req, res) => {
  models.getQuestions([req.body.product_id])
  .then((data) => {
    res.send(data.rows[0]).status(200)
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(404)
  })
});

// get all answers
app.get('/qa/questions/:question_id/answers', (req, res) => {

  // let vals = [parseInt(req.params.question_id), 1, 5];
  // if (Object.keys(req.body).length > 0 ) {
  //   vals[1] = parseInt(req.body.page);
  //   vals[2] = parseInt(req.body.count);
  // }
  let vals = [parseInt(req.params.question_id)];
  // how to add pages and count ???
  models.getAnswers(vals)
  .then((data) => {
    data.rows[0].page = parseInt(req.body.page);
    data.rows[0].count = parseInt(req.body.count);
    res.send(data.rows[0]).status(200);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(404);
  })

});

// post new question
app.post('/qa/questions', (req, res) => {

});

// post new answer
app.post('/qa/questions/:question_id/answers', (req, res) => {

});

// update helpful on question
app.put('/qa/questions/:question_id/helpful', (req, res) => {

});

// update helpful on answer
app.post('/qa/answers/:answer_id/helpful', (req, res) => {

});

// update reported on question
app.put('/qa/questions/:question_id/report', (req, res) => {

});

// update reported on answer
app.post('/qa/answers/:answer_id/report', (req, res) => {

});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})

pool.connect();