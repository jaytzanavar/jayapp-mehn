const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session= require('express-session');
const passport = require('passport');
const path = require('path');



const app = express();




// USe routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Pasport config
require('./config/passport')(passport);


// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//cookie: { secure: true }
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());





//Load App Model
require('./models/Idea');
// we gonna use it as a model
const Idea = mongoose.model('app');

//MAp global promise -get rid of warning
mongoose.Promise = global.Promise;
// connect to mongoose

mongoose.connect('mongodb://localhost/jayapp-dev', {
    useMongoClient: true
}).then(() => console.log('MongoDB connected !')).catch((err) => console.log(err));





const port = 5000;



//How middleware works
// in index it runs
app.use(function (req, res, next) {
    console.log(Date.now());
    req.name = ' Jay '
    next();
});

// Handle bars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'assets')));
// In order to inplement put or deletee
app.use(methodOverride('_method'))




app.use(flash());

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Index Route
app.get('/', (req, res) => {
    console.log(req.name);
    res.render('index', {
        title: "Jay main title"
    });

});

// ABOUT
app.get('/about', (req, res) => {
    res.render('about');
})



//find specific idea or all ideas
app.get('/search', (req, res) => {
    console.log(req.query.title)
    //res.send(req.body);
    let findShit=[];
    Idea.find({})
        .then(ideas => {
            
            ideas.forEach(idea => {
                console.log(idea.title);
                console.log(req.query)
                console.log(idea.title.includes(req.body));
                console.log(idea.details.includes(req.body));
               // console.log(idea.author.includes(req.body));
            if(idea.title.includes(req.query.title) || idea.details.includes(req.query.title) ){
                findShit.push(idea);
            }
            
           
        });
        if(findShit.length > 0){
            req.flash('success_msg', 'Search Results');
            res.render('ideas/index', {
                ideas: findShit
            });
        }
        else {
            req.flash('error_msg', 'Unable to fin results');
            res.render('ideas/index', {
                ideas: []
            });
        }
        
    }).catch(err =>{
        req.flash('error_msg', 'Something something wrong'+err);
    });
});






app.use('/ideas', ideas); // send in routing imported file
app.use('/users',users);




app.listen(port, () => {
    console.log(` Server started on port ${port}`);
});



//Load routes

