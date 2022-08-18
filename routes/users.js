var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
const Users = require('../models/users');

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
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        }) 
      }
  });
});


router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('content-type', 'text/plain');
  res.json({success: true, status: 'Login Successful!'});
  
});

router.post('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('session-id');
  res.redirect('/');
  
});

module.exports = router;