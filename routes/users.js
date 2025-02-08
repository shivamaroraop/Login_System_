const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {logout} = require("passport/lib/http/request");

require('../config/passport')(passport);

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check for empty fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter everything' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        return res.render('register', { errors, name, email, password, password2 });
    }

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                // User exists
                errors.push({ msg: 'User already exists' });
                return res.render('register', { errors, name, email, password, password2 });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        console.error('Error generating salt:', err);
                        return res.status(500).send('Server error');
                    }

                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            console.error('Error hashing password:', err);
                            return res.status(500).send('Server error');
                        }

                        newUser.password = hash;

                        newUser.save()
                            .then(user => {
                                req.flash('success_msg','You are now Registered and can Login!');
                              res.redirect('/users/login')
                            })
                            .catch(err => {
                                console.error('Error saving user:', err);
                                res.status(500).send('Server error');
                            });
                    });
                });
            }
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send('Server error');
        });
});

//Login Handle
router.post('/login', (req, res,next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash:true
    })(req,res,next);
});

//Logout
router.get('/logout', (req, res) => {
    req.logout(
        err=>{
            if(err){return next(arr);}
            req.flash('success_msg', 'Logged out');
            res.redirect('/users/login');
        }
    )
})
module.exports = router;
