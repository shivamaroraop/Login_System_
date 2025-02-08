module.exports = {
    ensureAuthenticated: function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Authentication Required');
        res.redirect('/users/login');
    }
}