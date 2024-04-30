let lives = 3;
let answeredCorrectly = false;

const getAnsweredCorrectly = () => {
  return answeredCorrectly;
}
/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('errorMessageContainer').classList.remove('hidden');
};

const handleAnswer = (results) => {
  console.log(results);
  message = `Your guess is: ${results.grade}!`;
  if (results.grade == 'right') {
    answeredCorrectly = true;
  }
  else {
    answeredCorrectly = false;
  }
  document.getElementById('results').innerHTML = message;
  document.getElementById('resultsMessage').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  document.getElementById('errorMessageContainer').classList.add('hidden');
  // document.getElementById('resultsMessage').classList.add('hidden');

  //if the result has a grade, it should be a response from guessAnswers in the game controller
  if (result.grade) {
    handleAnswer(result);
  }

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }

  if (handler) {
    handler(result);
  }
};

const hideError = () => {
  document.getElementById('errorMessageContainer').classList.add('hidden');
};

module.exports = {
  handleError,
  sendPost,
  hideError,
  lives,
  getAnsweredCorrectly,
};