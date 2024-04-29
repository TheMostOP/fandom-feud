const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

//TODO: Make more dynamic
let favShowAnswer = "N/A";
let favBookAnswer = "N/A";
let favMovieAnswer = "N/A";

let allPrompts = ["favShow", "favBook", "favMovie"];
let currentPrompt = "favShow";

let currentCorrectAnswer = "N/A";

const handleGuess = (e, onQuestionAnswered) => {
    e.preventDefault();
    helper.hideError();

    //what the user guessed for the answer
    const currentGuess = e.target.querySelector('#currentPrompt').value;

    if (!currentGuess) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {
        currentGuess: currentGuess, currentCorrectAnswer: currentCorrectAnswer, currentPrompt: currentPrompt,
    }, onQuestionAnswered);
    return false;
}

// const handleStart = (e, onButtonPressed) => {
//     e.preventDefault();
//     helper.hideError();

//     const testAsync = async () => {
//         const response = await helper.sendPost(e.target.action, {prompt: "favShow" }, onButtonPressed);
//         const data = await response.json();
//         console.log(data.answers);
//     };
//     testAsync();

//     // let test = helper.sendPost(e.target.action, {prompt: "favShow" }, onButtonPresses);
//     // console.log(test);
//     return false;
// }


const GuessingForm = (props) => {
    return (
        <form id="guessingForm"
            onSubmit={(e) => handleGuess(e, props.triggerReload)}
            name="guessingForm"
            action="/guess"
            method="POST"
            className="guessingForm"
        >
            <p>{currentCorrectAnswer}</p>
            <label htmlFor="currentPrompt">{currentPrompt} </label>
            <input id="currentPrompt" type="text" name="currentPrompt" placeholder="type your answer here" />
            <input className="guessingSubmit" type="submit" value="Submit Answer" />
        </form>
    )
}

// const StartButton = (props) => {
//     return (
//         <form id="startButton"
//             onSubmit={(e) => handleStart(e, props.triggerReload)}
//             name="startButton"
//             action="/getTopAnswers"
//             method="POST"
//             className="startButtonHolder"
//         >
//             <input className="startButton" type="submit" value="Start" />
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

// const AllAnswersList = (props) => {
//     const [answers, setAnswers] = useState(props.answers);

//     useEffect(() => {
//         const loadAnswersFromServer = async () => {
//             const response = await fetch('/getAllAnswers');
//             const data = await response.json();
//             setAnswers(data.answers);
//         };
//         loadAnswersFromServer();
//     }, [props.reloadAnswers]);

//     if (answers.length === 0) {
//         return (
//             <div className="answerList">
//                 <h3 className="emptyAnswers">No answers Yet!</h3>
//             </div>
//         );
//     }

//     const answerNodes = answers.map(answer => {
//         return (
//             <div key={answer.id} className="answer">
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

const TopAnswersList = (props) => {
    const [answers, setAnswers] = useState(props.answers);

    useEffect(() => {
        const loadAnswersFromServer = async () => {
            const response = await fetch(`/getTopAnswers?prompt=${currentPrompt}`);
            const data = await response.json();
            setAnswers(data.topAnswer);
        };
        loadAnswersFromServer();
    }, [props.reloadAnswers]);

    //if something got returned for the prompt, then we got data successfully
    if (answers.prompt != undefined) {
        currentCorrectAnswer = answers.response;
        const answerNodes = (
            <div key={answers.id} className="answer">
                <h3 className="prompt">Prompt: {answers.prompt}</h3>
                <h3 className="response">Response: {answers.response}</h3>
                <h3 className="votes">Votes: {answers.votes}</h3>
            </div>
        );

        return (
            <div className="answerList">
                {answerNodes}
            </div>
        );
    }
    else {
        return (
            <div className="answerList">
                <h3 className="emptyAnswers">No answers Yet!</h3>
            </div>
        );
    }

};

const Game = () => {
    const [reloadAnswers, setReloadAnswers] = useState(false);

    return (
        <div>
            <p>Guess what the most responded answer was to each prompt</p>
            <div id="answerQuestions">
                <GuessingForm triggerReload={() => setReloadAnswers(!reloadAnswers)} />
            </div>
            {/* <div id="game">
                <AllAnswersList answers={[]} reloadAnswers={reloadAnswers} />
            </div> */}
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