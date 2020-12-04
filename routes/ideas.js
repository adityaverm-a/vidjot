const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  ensureAuthenticated
} = require('../helpers/auth')

require("../models/Idea");
const Idea = mongoose.model("ideas");

router.get("/", ensureAuthenticated, function(req, res) {

  Idea.find({
      user: req.user.id
    })
    .sort({
      date: "desc"
    })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    })
})

router.get("/add", ensureAuthenticated, function(req, res) {
  res.render("ideas/add");
});

router.get("/edit/:id", ensureAuthenticated, function(req, res) {

  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      if (idea.user != req.user.id) {
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/ideas');
      } else {
        res.render("ideas/edit", {
          idea: idea
        });
      }
    });
});

router.post("/", ensureAuthenticated, function(req, res) {

  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: "Please add a title"
    });
  }
  if (!req.body.details) {
    errors.push({
      text: "Please add some details"
    });
  }

  if (errors.length > 0) {
    res.render("/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }

    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect("/ideas");
      })
  }
})

router.put("/:id", ensureAuthenticated, function(req, res) {

  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {

      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save()
        .then(idea => {
          req.flash("success_msg", "Video idea updated")
          res.redirect("/ideas");
        })
    })
})

router.delete("/:id", ensureAuthenticated, function(req, res) {

  Idea.deleteOne({
      _id: req.params.id
    })
    .then(() => {
      req.flash("success_msg", "Video idea removed");
      res.redirect("/ideas");
    })
})



module.exports = router;
