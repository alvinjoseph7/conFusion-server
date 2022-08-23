const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Promo = require('../models/promotions');
const cors = require('./cors');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Promo.find({})
    .then(promos => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(promos);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promo.create(req.body)
    .then(promo => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(promo);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promo.remove({})
    .then(response => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(response);

    }).catch(err => next(err));
});



// --------------------------------------------------


promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Promo.findById(req.params.promoId)
    .then(promo => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(promo);
     
    }).catch(err => next(err)); 
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('Post request not supported on /promotions/:promoId');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promo.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, 
    {new: true})
    .then(promo => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(promo);
     
    }).catch(err => next(err)); 
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promo.findByIdAndRemove(req.params.promoId)
    .then(response => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(response);

    }).catch(err => next(err));
});

module.exports = promoRouter;
