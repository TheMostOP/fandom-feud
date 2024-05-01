const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

//TODO: get prompts dynamically? Might be a stretch goal
let allPrompts = ["What is your favorite show?", "What is your favorite book?", "What is your favorite movie?", "What is your favorite musical?"];
let currentPromptIndex = 0;
let currentPrompt = allPrompts[currentPromptIndex];

let lives = 3;

let currentCorrectAnswer = "N/A";

const updatePrompt = () => {
    currentPromptIndex++;
    //make sure there are still prompts left
    if (currentPromptIndex >= allPrompts.length) {
        //TODO: switch to telling the player they won and giving them a score
        currentPromptIndex = 0;
    }
    currentPrompt = allPrompts[currentPromptIndex];
}

const handleGuess = async (e, onQuestionAnswered) => {
    e.preventDefault();
    helper.hideError();

    //what the user guessed for the answer
    const currentGuess = e.target.querySelector('#currentPrompt').value;

    if (!currentGuess) {
        helper.handleError('All fields are required');
        return false;
    }

    let test = await helper.sendPost(e.target.action, {
        currentGuess: currentGuess, currentCorrectAnswer: currentCorrectAnswer, currentPrompt: currentPrompt,
    }, onQuestionAnswered);

    //if they answered correct, update the current prompt
    if (helper.getAnsweredCorrectly()) {
        updatePrompt();
    }
    //if not, check if they are out of lives
    else if (lives > 0) {
        lives--;
    }
    //if not, subtract one life and let them try again
    else {
        //if so, reset lives, tell them the correct answer and move onto the next question
        lives = 3;
        document.getElementById('results').innerHTML = "Out of guesses. The correct answer is " + currentCorrectAnswer;
        updatePrompt();
    }


    return false;
}

const GuessingForm = (props) => {
    return (
        <form id="guessingForm"
            onSubmit={(e) => handleGuess(e, props.triggerReload)}
            name="guessingForm"
            action="/guess"
            method="POST"
            className="guessingForm"
        >
            <label class="label" htmlFor="currentPrompt">{currentPrompt} </label>
            <input class="input" id="currentPrompt" type="text" name="currentPrompt" placeholder="type your answer here" />
            <input class="button my-2" type="submit" value="Submit Answer" />
        </form>
    )
}

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
            <div class="is-hidden" key={answers.id} className="answer">
                <h3 class="is-hidden">Prompt: {answers.prompt}</h3>
                <h3 class="is-hidden" id="response">Response: {answers.response}</h3>
                <h3 class="is-hidden">Votes: {answers.votes}</h3>
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
            <h1>Welcome to Fandom Feud!</h1>
            <p>Guess what the most responded answer was to each prompt</p>
            <p>Guesses left: {lives}</p>
            <div id="answerQuestions">
                <GuessingForm triggerReload={() => setReloadAnswers(!reloadAnswers)} />
            </div>
            <div id="TopAnswers">
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

module.exports = {
    currentPromptIndex,
};