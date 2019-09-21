const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session= require('express-session');



const app = express();

//MAp global promise -get rid of warning
mongoose.Promise = global.Promise;
// connect to mongoose

mongoose.connect('mongodb://localhost/jayapp-dev', {
    useMongoClient: true
}).then(() => console.log('MongoDB connected !')).catch((err) => console.log(err));


//Load App Model
require('./models/Idea');
// we gonna use it as a model
const Idea = mongoose.model('app');


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
// In order to inplement put or deletee
app.use(methodOverride('_method'))


//cookie: { secure: true }
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

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

//Add Idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
})

//Edit Idea form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(
            idea => {
            res.render('ideas/edit',{
                idea: idea
            });
        }
    )  
})


//find specific idea
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
            res.render('ideas/index', {
                ideas: findShit
            });
        }
        else {
            res.render('ideas/index', {
                ideas: [{
                    title: '',
                    details:'',
                    author: '',
                }]
            });
        }
        
    }).catch(err =>{
        req.flash('error_msg', 'Something something wrong'+err);
    });
});


//Idea index Page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
            console.log(ideas);
        });
    // res.render('ideas/index')
});




//Process Form
app.post('/ideas', (req, res) => {
    console.log(req.body);
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            author: req.body.author,
        }
        new Idea(newUser).save()
            .then(idea => {
                res.redirect('/ideas');
            })
    }
    // res.send('ok');
});


//Edit form process
app.put('/ideas/:id', (req, res) =>{
    console.log(req.params);
    // res.send('PUT')
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        //update values
        idea.title =req.body.title;
        idea.details = req.body.details;
        idea.author = req.body.author;

        idea.save().then(idea => {
            res.redirect('/ideas');
        }).catch(err=> {
            console.log('Error in save', err);
        })

    
    }).catch(err => {
        console.log('error in initial',err);
    });

});

//DELETE Idea
app.delete('/ideas/:id', (req, res)=>{
  
    Idea.remove({ _id: req.params.id})
    .then(()=> {
        req.flash('success_msg', 'App Idea removed succesfully');
        res.redirect('/ideas');
    });
});

app.listen(port, () => {
    console.log(` Server started on port ${port}`);
});
