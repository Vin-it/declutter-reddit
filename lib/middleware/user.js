async function isInSession(req, res, next) {
    if (req.session.user && new Date(req.session.user.expires_on) > new Date()) {
        res.locals.isInSession = true
    } else {
        if (req.session.user) req.session.destroy();
        res.locals.isInSession = false
    }

    next();
}

module.exports = {
    isInSession,
}