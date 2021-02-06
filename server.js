const express = require('express');
const session = require('express-session');

const { initDebug, getLogger } = require('./lib/utils/debug');

const { PORT } = require('./lib/constants/app');
const { CLIENT_ID, REDIRECT_URI } = require('./lib/constants/oauth');

const app = express();

initDebug();
app.set('view engine', 'ejs');
app.use(session({
  secret: 'fakeSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.get('/', (req, res) => {
  if (!res.locals.isInSession) {
    res.redirect('/login');
  } else {
    res.send('Home');
  }
});

app.get('/login', (req, res) => {
  res.render('login', {
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
  });
});

app.post('/login', (req, res) => {
  res.send('Received login');
});

app.get('/redirect/reddit', require('./lib/routes/oauth/get-redirect'));

app.listen(PORT, () => {
  getLogger('debugServer')('App is listening to', PORT);
});
