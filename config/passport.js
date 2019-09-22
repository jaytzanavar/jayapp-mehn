const LocalStrategy = require('passport-local')
.Strategy;
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');

// Load Models
const User = mongoose.model('users');


// local stratgy , and serialize
module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>
    {
        console.log(email);
        console.log(password);
        // match the single user
        User.findOne({
            email:email
        }).then( user => {
            if(!user){
                return done(null, false, {message:'No User Found'}); //error , for user
            }

            // Match the encrypted passwords 
            bcrypt.compare(password, user.password, (err, isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }else {
                    return done(null, false , {message: 'Password Incorect'})
                }
            })
        })
    })); //after finish authenticating calling done fucntion

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

}