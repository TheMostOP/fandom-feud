const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

//TODO: If there's an error you can't figure out, it might be because onQuestionAnswered needs to be onAnswerAdded
// const handleAnswer = (e, onQuestionAnswered) => {
//     e.preventDefault();
//     helper.hideError();

//     const favShow = e.target.querySelector('#favShow').value;
//     const favBook = e.target.querySelector('#favBook').value;
//     const favMovie = e.target.querySelector('#favMovie').value;

//     if (!favShow || !favBook || !favMovie) {
//         helper.handleError('All fields are required');
//         return false;
//     }

//     helper.sendPost(e.target.action, { favShow: favShow, favBook: favBook, favMovie: favMovie, }, onQuestionAnswered);
//     return false;
// }

// const QuestionForm = (props) => {
//     return (
//         <form id="questionForm"
//             onSubmit={(e) => handleAnswer(e, props.triggerReload)}
//             name="questionForm"
//             action="/questions"
//             method="POST"
//             className="questionForm"
//         >
//             <label htmlFor="favShow">What's your favorite TV show? </label>
//             <input id="favShow" type="text" name="favShow" placeholder="e.g. Beverly Hillbillies" />
//             <label htmlFor="favBook">What's your favorite book? </label>
//             <input id="favBook" type="text" name="favBook" placeholder="e.g. The Great Gatsby" />
//             <label htmlFor="favMovie">What's your favorite movie? </label>
//             <input id="favMovie" type="text" name="favMovie" placeholder="e.g. It's a Wonderful Life" />
//             <input className="questionSubmit" type="submit" value="Submit Answers" />
//         </form>
//     )
// }

// //TODO: Remove or greatly alter this. Left for now for testing purposes
// const AnswerList = (props) => {
//     const [answers, setAnswers] = useState(props.answers);

//     useEffect(() => {
//         const loadAnswersFromServer = async () => {
//             const response = await fetch('/getAnswers');
//             const data = await response.json();
//             setAnswers(data.answers);
//         };
//         loadAnswersFromServer();
//     }, [props.reloadAnswers]);

//     if (answers.length === 0) {
//         return (
//             <div className="answerList">
//                 <h3 className="emptyAnswer">No Answers Yet!</h3>
//             </div>
//         );
//     }

//     const answerNodes = answers.map(answer => {
//         return (
//             <div key={answer.id} className="answer">
//                 {/* TODO: remove reference to Domo */}
//                 {/* <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace" /> */}
//                 <h3 className="favShow">Favorite Show: {answer.favShow}</h3>
//                 <h3 className="favBook">Favorite Book: {answer.favBook}</h3>
//                 <h3 className="favMovie">Favorite Movie: {answer.favMovie}</h3>
//             </div>
//         );
//     });

//     return (
//         <div className="answerList">
//             {answerNodes}
//         </div>
//     );
// };

const AllAnswersList = (props) => {
    const [answers, setAnswers] = useState(props.answers);

    useEffect(() => {
        const loadAnswersFromServer = async () => {
            const response = await fetch('/getAllAnswers');
            const data = await response.json();
            setAnswers(data.answers);
        };
        loadAnswersFromServer();
    }, [props.reloadAnswers]);

    if (answers.length === 0) {
        return (
            <div className="answerList">
                <h3 className="emptyAnswers">No answers Yet!</h3>
            </div>
        );
    }

    const answerNodes = answers.map(answer => {
        return (
            <div key={answer.id} className="answer">
                <h3 className="favShow">Favorite Show: {answer.favShow}</h3>
                <h3 className="favBook">Favorite Book: {answer.favBook}</h3>
                <h3 className="favMovie">Favorite Movie: {answer.favMovie}</h3>
            </div>
        );
    });

    return (
        <div className="answerList">
            {answerNodes}
        </div>
    );
};

const TopAnswersList = (props) => {
    const [answers, setAnswers] = useState(props.answers);

    useEffect(() => {
        const loadAnswersFromServer = async () => {
            const response = await fetch('/getTopAnswers');
            const data = await response.json();
            setAnswers(data.answers);
        };
        loadAnswersFromServer();
    }, [props.reloadAnswers]);

    console.log(answers);
    if (answers.length === 0) {
        return (
            <div className="answerList">
                <h3 className="emptyAnswers">No answers Yet!</h3>
            </div>
        );
    }

    const answerNodes = answers.map(answer => {
        return (
            <div key={answer.id} className="answer">
                <h3 className="prompt">Prompt: {answer.prompt}</h3>
                <h3 className="response">Response: {answer.response}</h3>
                <h3 className="votes">Votes: {answer.votes}</h3>
            </div>
        );
    });

    return (
        <div className="answerList">
            {answerNodes}
        </div>
    );
};

const Game = () => {
    const [reloadAnswers, setReloadAnswers] = useState(false);

    return (
        <div>
            {/* <div id="answerQuestions">
                <QuestionForm triggerReload={() => setReloadAnswers(!reloadAnswers)} />
            </div> */}
            <div id="game">
                <AllAnswersList answers={[]} reloadAnswers={reloadAnswers} />
            </div>
            <div id="TopAnswers">
                <p>Top Answers!</p>
                <TopAnswersList answers={[]} reloadAnswers={reloadAnswers} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('game'));
    root.render(<Game />);
};

window.onload = init;