module.exports = function isUserAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.redirect('/register')
    }
}