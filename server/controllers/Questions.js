const models = require('../models');

const { Answer } = models;

const questionPage = async (req, res) => res.render('questions');

const answerQuestions = async (req, res) => {
  if (!req.body.prompt || !req.body.response) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const answerData = {
    prompt: req.body.prompt,
    response: req.body.response,
    answerer: req.session.account._id,
  };

  try {
    const newAnswer = new Answer(answerData);
    await newAnswer.save();

    return res.status(201).json({
      prompt: newAnswer.prompt, response: newAnswer.response,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      // TODO: change this to be about if they already gave an answer
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
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
