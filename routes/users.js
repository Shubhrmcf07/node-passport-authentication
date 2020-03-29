var express = require('express')
var user = require('../models/Users')
var bcrypt = require('bcryptjs')
var router = express.Router();
var passport = require('passport')

router.get('/login', (req, res)=>{
    res.render('login')
})

router.get('/register', (req, res)=>{
    res.render('register')
})

router.post('/register', (req, res)=>{
    var {name, email, password, password2} = req.body

    let errors = []

    if(!email || !name || !password || !password2)
    {
        errors.push({msg : "Please fill all fields"})
    }

    if(password!=password2)
    {
        errors.push({msg : "Passwords Do not Match!"})
    }

    if(password.length < 6)
    {
        errors.push({msg : "Password too short, minimum 6 characters"})
    }

    if(errors.length > 0)
    {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }

    else{
        user.findOne({email : email}).then((users)=>{
            if(users){
                errors.push({msg : 'User already exists!'})
                res.render('register', {
                    errors, 
                    name, 
                    password,
                    password2
                })
            }

            else{
                var newUser = new user({
                    name, 
                    email,
                    password
                })

                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err;

                        newUser.password = hash     

                        newUser.save()
                        .then(()=>{
                            req.flash('success_msg', 'Successfully registered')
                            res.redirect('/user/login')
                        })
                        .catch((err)=>{throw err})
                    })
                })
            }
        })
    }
})


router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect : '/dashboard',
        failureRedirect : '/user/login',
        failureFlash : true
    })(req, res, next)
})

router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'Successfully logged out');
    res.redirect('/user/login')
})

module.exports =  router