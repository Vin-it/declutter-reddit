function setSession(req, user, accessToken, expiresOn) {
  req.session.user = {
    id: user.id,
    username: user.username,
    isImported: user.isImported,
    accessToken,
    expiresOn,
  };
}

module.exports = {
  setSession,
};
