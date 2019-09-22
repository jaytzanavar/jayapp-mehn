
const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Load App Model
require('../models/Idea');
// we gonna use it as a model
const Idea = mongoose.model('app');




//Idea index Page
router.get('/', (req, res) => {
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



//Add Idea form
router.get('/add', (req, res) => {
    res.render('ideas/add');
})

//Edit Idea form
router.get('/edit/:id', (req, res) => {
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




//Process Form
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) =>{
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
router.delete('/:id', (req, res)=>{
  
    Idea.remove({ _id: req.params.id})
    .then(()=> {
        req.flash('success_msg', 'App Idea removed succesfully');
        res.redirect('/ideas');
    });
});


module.exports = router;