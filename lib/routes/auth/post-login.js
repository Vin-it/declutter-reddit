const { getUserByUsername } = require('../../queries/users');

async function postLogin(req, res) {
  const { username } = req.body;

  const user = (await getUserByUsername(username))[0];

  if (!user) {
    const error = new Error('Incorrect combination of username and password');
    error.status = 400;
    res.status(400).send(error);
  }

  req.session.user = {
    username: user.username,
    accessToken: user.access_token,
    expiresOn: user.expires_on,
  };

  res.send(user);
}

module.exports = postLogin;
