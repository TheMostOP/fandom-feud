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

    helper.sendPost(e.target.action, { prompt: 'favShow', response: favShow, }, onQuestionAnswered);
    helper.sendPost(e.target.action, { prompt: 'favBook', response: favBook, }, onQuestionAnswered);
    helper.sendPost(e.target.action, { prompt: 'favMovie', response: favMovie, }, onQuestionAnswered);
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
            <label htmlFor="favShow">What's your favorite TV show? </label>
            <input id="favShow" type="text" name="favShow" placeholder="e.g. Beverly Hillbillies" />
            <label htmlFor="favBook">What's your favorite book? </label>
            <input id="favBook" type="text" name="favBook" placeholder="e.g. The Great Gatsby" />
            <label htmlFor="favMovie">What's your favorite movie? </label>
            <input id="favMovie" type="text" name="favMovie" placeholder="e.g. It's a Wonderful Life" />
            <input className="questionSubmit" type="submit" value="Submit Answers" />
        </form>
    )
}

//TODO: Remove or greatly alter this. Left for now for testing purposes
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
                <h3 className="favShow">{answer.prompt}: {answer.response}</h3>
                {/* <h3 className="favBook">Favorite Book: {answer.favBook}</h3>
                <h3 className="favMovie">Favorite Movie: {answer.favMovie}</h3> */}
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
        <div>
            <div id="answerQuestions">
                <QuestionForm triggerReload={() => setReloadAnswers(!reloadAnswers)} />
            </div>
            <div id="questions">
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