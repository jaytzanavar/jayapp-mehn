const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');




// Load User Mode

require('../models/User');
const User = mongoose.model('users');

// USER LOGIN - REGISTER ROUTE 

router.get('/login', (req, res) => {
    res.render('users/login')
})


router.get('/register', (req, res) => {
    res.render('users/register')
})



// Login form POST using passport! 
router.post('/login', (req,res, next)=>{ //get the next promice
    passport.authenticate('local', {
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req, res, next);
});

// Register Form POST
router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    if (req.body.password.length < 4) {
        errors.push({ text: 'Passwords must be at least 4 characters' });
    }

    if (errors.length > 0) {
        res.render('users/register',
            {
                errors: errors,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                password2: req.body.password2,
            })
    } else {

        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('/users/register');
                } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', "Welcome you are now registered");
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })




                        });
                    })
                }
            });
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })


        console.log(newUser)
        //res.send('passed');
    }
})

module.exports = router;