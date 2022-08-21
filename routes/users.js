var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
const Users = require('../models/users');
var authenticate = require('../authenticate');

router.use(bodyParser.json());

router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  console.log(req.user);
  Users.find()
  .then(users => {
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    res.json(users);
  }).catch(err => next(err));
});

router.post('/signup', function(req, res, next) {
  Users.register(new Users({username: req.body.username}), 
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save()
        .then(user => {
          // passport.authenticate('local', {session: false})(req, res, () => {
          //   var token = authenticate.getToken({_id: req.user._id});
          // }) ;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        }).catch(err => {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }
        );

      }
  });
});


router.post('/login', passport.authenticate('local', {session: false}), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('content-type', 'text/plain');
  res.json({success: true, token: token, status: 'Login Successful!'});
  
});

router.post('/logout', (req, res, next) => {
  res.redirect('/');
});

module.exports = router;