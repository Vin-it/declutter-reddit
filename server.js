const express = require('express');
const session = require('express-session');

const app = express();

const { PORT } = require('./lib/constants/app');

app.use(session({
  secret: 'fakeSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.get('/', (req, res) => {
  if (!res.locals.isInSession) {
    res.redirect('/login');
} else {
    res.send("Home");
}
});

app.get('/login', (req, res) => {
  res.send('Click here to authorize this app to use your reddit account or if you have already done so please enter your username below');
});

app.listen(PORT, () => {
  console.log('App is listening to', PORT);
});