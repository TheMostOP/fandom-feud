const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/getPublicDomos', mid.requiresLogin, controllers.Domo.getPublicDomos);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);

  app.get('/getAnswers', mid.requiresLogin, controllers.Questions.getAnswers);
  app.get('/questions', mid.requiresLogin, controllers.Questions.questionPage);
  app.post('/questions', mid.requiresLogin, controllers.Questions.answerQuestions);

  app.get('/game', mid.requiresLogin, controllers.Game.gamePage);
  app.get('/getAllAnswers', mid.requiresLogin, controllers.Game.getAllAnswers);
  app.get('/getTopAnswers', mid.requiresLogin, controllers.Game.getTopAnswers);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;