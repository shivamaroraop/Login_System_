const express=require('express');
const PORT=process.env.PORT || 8080;
const app=express();
const expressLayouts = require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
//Db
const db=require('./config/keys.js').MongoURI;
//Connect to Mongo
mongoose.connect(db,{})
    .then(()=>console.log('MongoDB Connected!'))
    .catch((err)=>console.log(err));
//passport config
require('./config/passport')(passport);
//ejs
app.use(expressLayouts);
app.set('view engine','ejs');
app.set('layout','layouts');

//body parser
app.use(express.urlencoded({ extended: false }));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//Global vars for flash messages
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
})


//Routes
app.use('/',require('./routes/app'));

app.use('/users',require('./routes/users'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})