var express = require('express')
var {ensureAuthenticated}  = require('../config/auth')
var router = express.Router();

router.get('/', (req, res)=>{
    res.render('welcome')
})

router.get('/dashboard',ensureAuthenticated, (req, res)=>{
    res.render('dashboard', {
        name : req.user.name
    })
})

module.exports =  router