const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req, res, next) => {
	Dishes.find({})
	.then(dishes => {
		res.status(200);
		res.setHeader('content-type', "application/json");
		res.json(dishes);
	}).catch(err => {
		// console.log(err);
		next(err);	
	})	
})
.post((req, res, next) => {
	Dishes.create(req.body)
	.then(dish => {
		res.status(200);
		res.setHeader('content-type', "application/json");
		res.json(dish);
	}).catch(err => next(err));
})
.put((req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
	Dishes.remove({})
	.then(response => {
		res.status(200);
		res.setHeader('content-type', "application/json");
		res.json(response);
	}).catch(err => next(err));
});





dishRouter.route('/:dishId')
.get((req, res, next) => {
	Dishes.findById(req.params.dishId)
	.then(dish => {
		console.log("fsdfdsfds");
		res.status(200);
		res.setHeader('content-type', "application/json");
		res.json(dish);
	}).catch(err => next(err));
})
.post((req, res, next) => {
	res.statusCode = 403;
	res.end('Post request not supported on /dishes/:dishId');
})
.put((req, res, next) => {
	Dishes.findByIdAndUpdate(req.params.dishId,
		{ $set: req.body }, {new:true})
		.then(dish => {
			res.status(200);
			res.setHeader('content-type', "application/json");
			res.json(dish);
		}).catch(err => next(err));
})
.delete((req, res, next) => {
	Dishes.findByIdAndRemove(req.params.dishId)
	.then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch((err) => next(err));
});

module.exports = dishRouter;
