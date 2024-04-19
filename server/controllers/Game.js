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

const getAnswers = async (req, res) => {
    try {
        const query = { answerer: req.session.account._id };
        const docs = await Answer.find({query}).select('favShow favBook favMovie').lean().exec();

        return res.json({ answers: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving answers!' });
    }
};

const getAllAnswers = async (req, res) => {
  try {
    const docs = await Answer.find({}).select('favShow favBook favMovie').lean().exec();

    return res.json({ answers: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving answers!' });
  }
};

module.exports = {
    gamePage,
    //answerQuestions,
    //getAnswers,
    getAllAnswers,
};
