var express = require('express')
var expressLayouts = require('express-ejs-layouts')
var mongoose = require('mongoose')
var flash = require('connect-flash')
var session = require('express-session')
var passport = require('passport')
var db = require('./config/keys').MongoURI

mongoose.connect(db, {useNewUrlParser : true})
.then(()=>console.log("Connected"))
.catch(err=>console.log(err))

var app = express();

require('./config/passport')(passport)


app.use(expressLayouts);
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended : false}))

app.use(session({
    secret : 'hello',
    resave : true,
    saveUninitialized : true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

app.use((req, res, next)=>{
    app.locals.success_msg = req.flash('success_msg')
    app.locals.error_msg = req.flash('error_msg')
    app.locals.error = req.flash('error')
    next()
})

app.use('/', require('./routes/index'))

app.use('/user', require('./routes/users'))

var port = process.env.PORT || 3000

app.listen(port, console.log(`Server started on port ${port}`))