function getLogout(req, res) {
  req.session.destroy();
  res.redirect('/');
}

module.exports = getLogout;
