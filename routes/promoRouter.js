const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Promo = require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req, res, next) => {
    Promo.find({})
    .then(promos => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(promos);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Promo.create(req.body)
    .then(promo => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(promo);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promo.remove({})
    .then(response => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(response);

    }).catch(err => next(err));
});



// --------------------------------------------------


promoRouter.route('/:promoId')
.get((req, res, next) => {
    Promo.findById(req.params.promoId)
    .then(promo => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(promo);
     
    }).catch(err => next(err)); 
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Post request not supported on /promotions/:promoId');
})
.put(authenticate.verifyUser, (req, res, next) => {
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
.delete(authenticate.verifyUser, (req, res, next) => {
    Promo.findByIdAndRemove(req.params.promoId)
    .then(response => {
        res.status(200);
        res.setHeader('content-type', 'application/json');
        res.json(response);

    }).catch(err => next(err));
});

module.exports = promoRouter;
