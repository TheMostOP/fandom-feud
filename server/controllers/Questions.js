const models = require('../models');

const { Answer } = models;

const questionPage = async (req, res) => res.render('questions');

// modified from Simple Model Assignment 1 from IGME 430
const updateAnswer = (query, answerData, res) => {
  const updatePromise = Answer.findOneAndUpdate(query, { response: answerData.response }, {
    returnDocument: 'after', // Populates doc in the .then() with the version after update
    sort: { createdDate: 'descending' },
  }).lean().exec();

  // If we successfully save/update the database, send back the answer's info.
  updatePromise.then((doc) => res.json({
    prompt: doc.prompt,
    response: doc.response,
  }));

  // If something goes wrong saving to the database, log the error and send a message to the client.
  updatePromise.catch((err) => {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  });
};

const answerQuestions = async (req, res) => {
  if (!req.body.prompt || !req.body.response) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const answerData = {
    prompt: req.body.prompt,
    response: req.body.response,
    answerer: req.session.account._id,
  };

  // first, check if they've already answers this prompt.
  // If so, edit the old one instead of making a new one...
  const query = { prompt: answerData.prompt, answerer: answerData.answerer };
  const docs = await Answer.find(query).select('prompt response').lean().exec();
  if (docs[0]) {
    return updateAnswer(query, answerData, res);
  }
  // ...if not, create a new answer

  try {
    const newAnswer = new Answer(answerData);
    await newAnswer.save();

    return res.status(201).json({
      prompt: newAnswer.prompt,
      response: newAnswer.response,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'error updating answer' });
    }
    return res.status(500).json({ error: 'An error occured making answerf!' });
  }
};

const getAnswers = async (req, res) => {
  try {
    const query = { answerer: req.session.account._id };
    const docs = await Answer.find(query).select('prompt response').lean().exec();

    return res.json({ answers: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving answers!' });
  }
};

// const getPublicDomos = async (req, res) => {
//   try {
//     const query = { publicity: 'true' };
//     const docs = await Domo.find(query).select('name age element publicity').lean().exec();

//     return res.json({ domos: docs });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: 'Error retrieving domos!' });
//   }
// };

module.exports = {
  questionPage,
  answerQuestions,
  getAnswers,
  //   getPublicDomos,
};
