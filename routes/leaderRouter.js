const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Leader = require('../models/leaders');
const cors = require('./cors');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Leader.find({})
    .then(leaders => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(leaders);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leader.create(req.body)
    .then(leader => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(leader);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leader.remove({})
    .then(response => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(response);

    }).catch(err => next(err)); 
});


//------------------------------------------------------------

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Leader.findById(req.params.leaderId)
    .then(leader => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(leader);
     
    }).catch(err => next(err)); 
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('Post request not supported on /leaders/:leaderId');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leader.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, 
    {new: true})
    .then(leader => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(leader);
     
    }).catch(err => next(err)); 
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leader.findByIdAndRemove(req.params.leaderId)
    .then(response => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(response);

    }).catch(err => next(err));
});

module.exports = leaderRouter;