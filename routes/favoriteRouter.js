const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Favorite = require('../models/favorite');

var app = express.Router();

app.use(bodyParser.json());


app.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then(fav => {
        if (fav) {
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            res.json(fav);
        } else {
            var err = new Error('No favorites found!');
            err.status = 404;
            return next(err);
        }
    }).catch(err => next(err));
})

.post(authenticate.verifyUser , (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(fav => {
        if (fav) {
            //fav exists
            req.body.forEach(obj => {
                if (fav.dishes.indexOf(obj._id) === -1)
                    fav.dishes.push(obj._id);
            });
            fav.save()
            .then(result => {
                res.statusCode = 200;
                res.setHeader('content-type', 'application/json');
                res.json(result);
            }).catch(err => next(err));
        } 
        
        
        
        else {
            //fav document does not exist
            Favorite.create({user: req.user._id})
            .then(fav => {
                req.body.forEach(obj => {
                    if (fav.dishes.indexOf(obj._id) === -1)
                    fav.dishes.push(obj._id);
                });
                fav.save()
                .then(result => {
                    res.statusCode = 200;
                    res.setHeader('content-type', 'application/json');
                    res.json(result);
                }).catch(err => next(err));
            }).catch(err => next(err));

        }
        
    }).catch(err => next(err));
})

.put(authenticate.verifyUser, (req, res, next) => {
    var err = new Error('Put operation not supported on /favorites endpoint.');
    err.status = 404;
    return next(err);
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Favorite.deleteOne({user: req.user._id})
    .then(response => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(response);
    }).catch(err => next(err));
});

app.post('/:dishId', authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(fav => {
        fav.dishes.push(req.params.dishId);
        fav.save()
        .then(result => {
            res.status(200);
            res.setHeader('content-type', "application/json");
            res.json(result);
        }).catch(err => next(err));
    }).catch(err => next(err));
});

app.delete('/:dishId', authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(fav => {
        var index = fav.dishes.indexOf(req.params.dishId);
        if (index > -1) {
            fav.dishes.splice(index, 1);
            fav.save()
            .then(result => {
                res.status(200);
                res.setHeader('content-type', "application/json");
                res.json(result);
            }).catch(err => next(err));

        }
    }).catch(err => next(err));
});

module.exports = app;
