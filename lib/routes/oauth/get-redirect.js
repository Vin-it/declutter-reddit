const axios = require('axios');

const { insertUserIfNotExist } = require('./../../queries/users');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = require('../../constants/oauth');

module.exports = async function(req, res) {
    let user, tokens = {};
    const { state, code } = req.query;
  
    try {
      if (state && code) {
          try {
            tokens = await axios.post(
                'https://www.reddit.com/api/v1/access_token',
                `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`,
                {
                    auth: {
                        username: CLIENT_ID,
                        password: CLIENT_SECRET,
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
          } catch (error) {
            console.log(error);
          }
      }

      if (tokens) {
        const { access_token, refresh_token, expires_in } = tokens.data;
        const expires_on = new Date(new Date().getTime() + expires_in * 1000);
        const { data } = await axios.get('https://oauth.reddit.com/api/v1/me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        user = {
            username: data.name,
            access_token,
            refresh_token,
            expires_on: expires_on,
        }
        req.session.user = {
            username: data.name,
            access_token: access_token,
            expires_on: expires_on,
        }

        const returnedUser = await insertUserIfNotExist(user);

        if (returnedUser) console.log("User successfully created", user);

        if (returnedUser && !returnedUser.password) {
            res.render('index', { user: user });
        } else if (returnedUser && returnedUser.password) {
            res.send('This is where app\'s functions will exist');
        }

    }

    } catch (error) {
        console.error(error.message);
        res.send('Something went wrong!');
    }

    res.end();
}