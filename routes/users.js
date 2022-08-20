var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
const Users = require('../models/users');
var authenticate = require('../authenticate');

router.use(bodyParser.json());

router.post('/signup', function(req, res, next) {
  Users.register(new Users({username: req.body.username}), 
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else {
        // req.login(user);
        passport.authenticate('local', {session: false})(req, res, () => {
          var token = authenticate.getToken({_id: req.user._id});
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        }) 
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