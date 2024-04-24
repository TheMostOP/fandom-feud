const models = require('../models');

const { Answer } = models;
const { Game } = models;

const gamePage = async (req, res) => res.render('game');

// so far just called within this controller
const makeTopAnswer = (prompt, response, votes) => {
  const answerData = {
    prompt,
    response,
    votes,
  };

  try {
    const newAnswer = new Game(answerData);
    newAnswer.save();

    return {
      prompt: newAnswer.prompt, response: newAnswer.response, votes: newAnswer.votes,
    };
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      // TODO: change this to be about if they already gave an answer
      return { error: 'answer already exists!' };
    }
    return { error: 'An error occured making top answer!' };
  }
};

// const getAnswers = async (req, res) => {
//   try {
//     const query = { answerer: req.session.account._id };
//     const docs = await Answer.find({ query }).select('favShow favBook favMovie').lean().exec();

//     return res.json({ answers: docs });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: 'Error retrieving answers!' });
//   }
// };

const getAllAnswers = async (req, res) => {
  try {
    const docs = await Answer.find({}).select('prompt response').lean().exec();

    return res.json({ answers: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving answers!' });
  }
};

// TODO: This is currently a modified version of getAllAnswers
// perhaps change it to call getAllAnswers or at least inherit from it?
const getTopAnswers = async (req, res) => {
  try {
    // get all the answers for the given prompt
    const query = { prompt: req.query.prompt };
    // docs is an array of every answer
    // every answer can access the strings associated with each prompt with .response
    let docs = await Answer.find({ query }).select('prompt response').lean().exec();

    // first, sort the answers alphabetically by response
    docs = docs.sort((a, b) => (a.response.localeCompare(b.response)));
    // find out which answer is present the most times
    // by counting until the answer changes and seeing if it's larger than the last
    let counter = 0;
    let prevCount = 0;
    let topAnswer = 'N/A';
    for (let i = 0; i < docs.length; i++) {
      // go through every answer until the prompt changes
      // first check if we're at the end of the array
      // this has to be handled differently do we don't index out
      // being at the end of the array should be treated like the next check being a mismatch
      if ((i !== docs.length - 1) && (docs[i].response === docs[i + 1].response)) {
        // if we're not at the end of the array
        // and if the show is the same as the next, add 1 to the counter
        counter++;
      } else if (counter > prevCount) {
        // if the show is different from the next one, compare it to the previous counter.
        // if it's greater, set it as the new top answer and reset the counters
        topAnswer = docs[i].response;
        prevCount = counter;
        counter = 0;
      } else {
        // if not, only reset the current counter
        counter = 0;
      }
    }

    const topAnswerForPrompt = makeTopAnswer(req.query.prompt, topAnswer, prevCount);
    console.log(topAnswerForPrompt);
    return res.json({ topAnswer: topAnswerForPrompt });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving answers!' });
  }
};

const guessAnswers = async (req, res) => {
  if (!req.body.favShowGuess || !req.body.favBookGuess || !req.body.favMovieGuess) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const answerData = {
    favShowGuess: req.body.favShowGuess,
    favBookGuess: req.body.favBookGuess,
    favMovieGuess: req.body.favMovieGuess,
    favShowAnswer: req.body.favShowAnswer,
    favBookAnswer: req.body.favBookAnswer,
    favMovieAnswer: req.body.favMovieAnswer,
    answerer: req.session.account._id,
  };

  let favShowGrade = 'wrong';
  let favMovieGrade = 'wrong';
  let favBookGrade = 'wrong';

  try {
    // TODO: Make more dynamic
    if (answerData.favShowGuess === answerData.favShowAnswer) {
      favShowGrade = 'right';
    }
    if (answerData.favBookGuess === answerData.favBookAnswer) {
      favBookGrade = 'right';
    }
    if (answerData.favMovieGuess === answerData.favMovieAnswer) {
      favMovieGrade = 'right';
    }
    // const newAnswer = new Answer(answerData);
    // await newAnswer.save();

    return res.status(201).json({
      favShowGrade, favBookGrade, favMovieGrade,
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

module.exports = {
  gamePage,
  // answerQuestions,
  // getAnswers,
  getAllAnswers,
  getTopAnswers,
  guessAnswers,
};
