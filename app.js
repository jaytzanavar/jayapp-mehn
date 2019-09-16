const express = require('express');
const exphbs = require ('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//MAp global promise -get rid of warning
mongoose.Promise = global.Promise;
// connect to mongoose

mongoose.connect('mongodb://localhost/jayapp-dev', {
    useMongoClient: true
}).then(()=> console.log('MongoDB connected !')).catch( (err)=> console.log(err));


//Load App Model
require('./models/Idea');

const Idea = mongoose.model('app');


const port = 5000;



//How middleware works
// in index it runs
app.use(function(req, res, next){
    console.log(Date.now());
    req.name=' Jay '
    next();
});

// Handle bars Middleware
app.engine('handlebars', exphbs({
    defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Index Route
app.get('/', ( req , res) => {
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
app.get('/ideas/add', (req, res)=>{
    res.render('ideas/add');
})

//Process Form
app.post('/ideas', (req, res)=>{
    console.log(req.body);
    let errors = [];

    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'});
    }

    if(errors.length > 0){
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else {
        res.send('passed');
    }
   // res.send('ok');
});


app.listen(port , ()=> {
    console.log(` Server started on port ${port}`);
});
