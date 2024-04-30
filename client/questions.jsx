const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

//TODO: If there's an error you can't figure out, it might be because onQuestionAnswered needs to be onAnswerAdded
const handleAnswer = (e, onQuestionAnswered) => {
    e.preventDefault();
    helper.hideError();

    const favShow = e.target.querySelector('#favShow').value;
    const favBook = e.target.querySelector('#favBook').value;
    const favMovie = e.target.querySelector('#favMovie').value;

    if (!favShow || !favBook || !favMovie) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { prompt: 'What is your favorite show?', response: favShow, }, onQuestionAnswered);
    helper.sendPost(e.target.action, { prompt: 'What is your favorite book?', response: favBook, }, onQuestionAnswered);
    helper.sendPost(e.target.action, { prompt: 'What is your favorite movie?', response: favMovie, }, onQuestionAnswered);
    return false;
}

const QuestionForm = (props) => {
    return (
        <form id="questionForm"
            onSubmit={(e) => handleAnswer(e, props.triggerReload)}
            name="questionForm"
            action="/questions"
            method="POST"
            className="questionForm"
        >
            <h1>Your Questionaire</h1>
            <p>Answer the following questions. Your answers will be recorded.</p>
            <label class="label" htmlFor="favShow">What's your favorite TV show? </label>
            <input class="input" id="favShow" type="text" name="favShow" placeholder="e.g. Beverly Hillbillies" />
            <label class="label" htmlFor="favBook">What's your favorite book? </label>
            <input class="input" id="favBook" type="text" name="favBook" placeholder="e.g. The Great Gatsby" />
            <label class="label" htmlFor="favMovie">What's your favorite movie? </label>
            <input class="input" id="favMovie" type="text" name="favMovie" placeholder="e.g. It's a Wonderful Life" />
            <input class="button my-2" type="submit" value="Submit Answers" />
        </form>
    )
}

const AnswerList = (props) => {
    const [answers, setAnswers] = useState(props.answers);

    useEffect(() => {
        const loadAnswersFromServer = async () => {
            const response = await fetch('/getAnswers');
            const data = await response.json();
            setAnswers(data.answers);
        };
        loadAnswersFromServer();
    }, [props.reloadAnswers]);

    if (answers.length === 0) {
        return (
            <div className="answerList">
                <h3 className="emptyAnswer">No Answers Yet!</h3>
            </div>
        );
    }

    const answerNodes = answers.map(answer => {
        return (
            <div key={answer.id} className="answer">
                <p className="usersAnswers">{answer.prompt}: {answer.response}</p>
            </div>
        );
    });

    return (
        <div className="answerList">
            {answerNodes}
        </div>
    );
};

const Questions = () => {
    const [reloadAnswers, setReloadAnswers] = useState(false);

    return (
        <div class="m-5">
            <div class="field" id="answerQuestions">
                <QuestionForm triggerReload={() => setReloadAnswers(!reloadAnswers)} />
            </div>
            <div id="questions">
                <h2>Your Answers!</h2>
                <AnswerList answers={[]} reloadAnswers={reloadAnswers} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('questionForm'));
    root.render(<Questions />);
};

window.onload = init;