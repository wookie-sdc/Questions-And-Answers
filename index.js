const express = require('express');
const pool = require('./postgresDB/index.js');
const models = require('./postgresDB/models.js');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

// last questions id: 3518963
// last answers id: 6879306
// last photos id: 2063759

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

  // fix pages and count...
  let vals = [parseInt(req.params.question_id), 5];
  if (Object.keys(req.body).length > 0 ) {

    vals[1] = parseInt(req.body.count);
    // vals[2] = (parseInt(req.body.page) - 1) * vals[1] ;
  }
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
  let vals = [req.body.body, req.body.name, req.body.email, req.body.product_id];
  models.postQuestion(vals)
  .then(() => res.sendStatus(201))
  .catch((err) => {console.log(err); res.sendStatus(404)})
});

// post new answer
app.post('/qa/questions/:question_id/answers', (req, res) => {
  let vals = [req.params.question_id, req.body.body, req.body.name, req.body.email, req.body.photos.slice(1, req.body.photos.length-1)];
  models.postAnswer(vals)
  .then(()=> res.sendStatus(201))
  .catch((err) => {console.log(err); res.sendStatus(404)})
});

// update helpful on question
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  models.markQHelpful([req.params.question_id])
  .then(() => res.sendStatus(204))
  .catch((err) => {console.log(err); res.sendStatus(404)})
});

// update helpful on answer
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  models.markAHelpful([req.params.answer_id])
  .then(() => res.sendStatus(204))
  .catch((err) => {console.log(err); res.sendStatus(404)})
});

// update reported on question
app.put('/qa/questions/:question_id/report', (req, res) => {
  models.reportQuestion([req.params.question_id])
  .then(() => res.sendStatus(204))
  .catch((err) => {console.log(err); res.sendStatus(404)})

});

// update reported on answer
app.put('/qa/answers/:answer_id/report', (req, res) => {
  models.reportAnswer([req.params.answer_id])
  .then(() => res.sendStatus(204))
  .catch((err) => {console.log(err); res.sendStatus(404)})
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})

pool.connect();