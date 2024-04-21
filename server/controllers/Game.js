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
    const docs = await Answer.find({}).select('favShow favBook favMovie').lean().exec();

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
    // docs is an array of every answer
    // every answer can access the strings associated with each prompt with .[name of prompt]
    let docs = await Answer.find({}).select('favShow favBook favMovie').lean().exec();

    // first, sort the answers alphabetically, starting with favshow
    docs = docs.sort((a, b) => (a.favShow.localeCompare(b.favShow)));
    // find out which answer is present the most times
    // by counting until the answer changes and seeing if it's larger than the last
    let counter = 0;
    let prevCount = 0;
    let topAnswer = 'N/A';
    for (let i = 0; i < docs.length; i++) {
      // first check if we're at the end of the array
      // this has to be handled differently do we don't index out
      // being at the end of the array should be treated like the next check being a mismatch
      if ((i !== docs.length - 1) && (docs[i].favShow === docs[i + 1].favShow)) {
        // if we're not at the end of the array
        // and if the show is the same as the next, add 1 to the counter
        counter++;
      } else if (counter > prevCount) {
        // if the show is different from the next one, compare it to the previous counter.
        // if it's greater, set it as the new top answer and reset the counters
        topAnswer = docs[i].favShow;
        prevCount = counter;
        counter = 0;
      } else {
        // if not, only reset the current counter
        counter = 0;
      }
    }

    const topShow = makeTopAnswer('favShow', topAnswer, prevCount);

    // repeat for favBook and favMovie
    // TODO: make this more dynamic
    docs = docs.sort((a, b) => (a.favBook.localeCompare(b.favBook)));
    // find out which answer is present the most times
    // by counting until the answer changes and seeing if it's larger than the last
    counter = 0;
    prevCount = 0;
    topAnswer = 'N/A';
    for (let i = 0; i < docs.length; i++) {
      // first check if we're at the end of the array
      // this has to be handled differently do we don't index out
      // being at the end of the array should be treated like the next check being a mismatch
      if ((i !== docs.length - 1) && (docs[i].favBook === docs[i + 1].favBook)) {
        // if we're not at the end of the array
        // and if the show is the same as the next, add 1 to the counter
        counter++;
      } else if (counter > prevCount) {
        // if the show is different from the next one, compare it to the previous counter.
        // if it's greater, set it as the new top answer and reset the counters
        topAnswer = docs[i].favBook;
        prevCount = counter;
        counter = 0;
      } else {
        // if not, only reset the current counter
        counter = 0;
      }
    }

    const topBook = makeTopAnswer('favBook', topAnswer, prevCount);

    return res.json({ answers: [topShow, topBook] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving answers!' });
  }
};

module.exports = {
  gamePage,
  // answerQuestions,
  // getAnswers,
  getAllAnswers,
  getTopAnswers,
};
