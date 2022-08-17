var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const Users = require('../models/users');

router.use(bodyParser.json());

router.post('/signup', function(req, res, next) {
  Users.findOne({username: req.body.username})
  .then(user => {
    if (user != null) {
      var err = new Error('User with username ' + req.body.username + ' already exists.');
      err.status = 403;
      next(err);
      return;

    } else {
      Users.create({
        username: req.body.username, 
        password: req.body.password
      })
      .then(user => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json({status: "application successful", user: user});
      })
    }
  }).catch(err => next(err));
  
});


router.post('/login', (req, res, next) => {
  if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }

    var creds = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = creds[0];
    var password = creds[1];

    Users.findOne({username: username})
    .then(user => {
      if (!user) {
        var err = new Error('User ' + username + ' does not exist.');
        err.status = 403;
        next(err);
        return;
      }
      else if (user.password != password) {
        var err = new Error('Password incorrect!');
        err.status = 403;
        return next(err);
      }
      else if (user.username === username && user.password === password) {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('content-type', 'text/plain');
        res.end('You are authenticated');

      }
    }).catch(err => next(err));

  } else {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/plain');
    res.end('You are already authenticated');
  }
  
});

router.get('/logout', (req, res, next) => {
  if (!req.session.user) {
    var err = new Error('You are not authenticated.');
    err.status = 403;
    next(err);
    return;
  } 
  req.session.destroy();
  res.clearCookie('session-id');
  res.redirect('/');
  
})

module.exports = router;