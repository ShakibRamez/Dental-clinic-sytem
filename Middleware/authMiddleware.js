function checkAuth(req, res, next) {
    console.log('object');
    if(!req.session.user){
        return res.redirect('/');
    }
    next();
}

module.exports = checkAuth;