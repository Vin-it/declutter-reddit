const express = require('express');
const session = require('express-session');

const app = express();

const { PORT } = require('./lib/constants/app');

app.set('view engine', 'ejs');
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
  res.render('login');
});

app.post('/login', (req, res) => {
  res.send('Received login');
});

app.listen(PORT, () => {
  console.log('App is listening to', PORT);
});