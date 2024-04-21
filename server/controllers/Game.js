const models = require('../models');

const { Answer } = models;

const gamePage = async (req, res) => res.render('game');

// const answerQuestions = async (req, res) => {
//     if (!req.body.favShow || !req.body.favBook || !req.body.favMovie) {
//         return res.status(400).json({ error: 'All fields are required!' });
//     }

//     const answerData = {
//         favShow: req.body.favShow,
//         favBook: req.body.favBook,
//         favMovie: req.body.favMovie,
//         answerer: req.session.account._id,
//     };

//     try {
//         const newAnswer = new Answer(answerData);
//         await newAnswer.save();

//         return res.status(201).json({
//             favShow: newAnswer.favShow, favBook: newAnswer.favBook, favMovie: newAnswer.favMovie,
//         });
//     } catch (err) {
//         console.log(err);
//         if (err.code === 11000) {
//             // TODO: change this to be about if they already gave an answer
//             return res.status(400).json({ error: 'Domo already exists!' });
//         }
//         return res.status(500).json({ error: 'An error occured making domo!' });
//     }
// };

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
    const docs = await Answer.find({}).select('favShow favBook favMovie').lean().exec();

    // first, sort the answers alphabetically, starting with favshow
    const sortedDocs = docs.sort((a, b) => (a.favShow.localeCompare(b.favShow)));
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
        console.log(counter);
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

      console.log(docs[i]);
      console.log(topAnswer);
    }

    return res.json({ answers: sortedDocs });
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
