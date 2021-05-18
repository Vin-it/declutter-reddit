function getLoggedInUser(req, res) {
  if (!res.locals.isInSession) {
    res.status(401).send();
  } else {
    res.status(200).json({ data: { user: req.session.user } });
  }
}

module.exports = getLoggedInUser;
