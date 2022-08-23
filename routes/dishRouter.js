const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const cors = require('./cors');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
	Dishes.find({})
	.populate('comments.author')
	.then(dishes => {
		res.status(200);
		res.setHeader('content-type', "application/json");
		res.json(dishes);
	}).catch(err => {
		next(err);	
	})	
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin , (req, res, next) => {
	Dishes.create(req.body)
	.then(dish => {
		res.status(200);
		res.setHeader('content-type', "application/json");
		res.json(dish);
	}).catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Dishes.remove({})
	.then(response => {
		res.status(200);
		res.setHeader('content-type', "application/json");
		res.json(response);
	}).catch(err => next(err));
});



//--------------------------------------------------

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.populate('comments.author')
	.then(dish => {
		res.status(200);
		res.setHeader('content-type', "application/json");
		res.json(dish);
	}).catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end('Post request not supported on /dishes/:dishId');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Dishes.findByIdAndUpdate(req.params.dishId,
		{ $set: req.body }, {new:true})
		.then(dish => {
			res.status(200);
			res.setHeader('content-type', "application/json");
			res.json(dish);
		}).catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Dishes.findByIdAndRemove(req.params.dishId)
	.then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch((err) => next(err));
});



//--------------------------------------------------


dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.populate('comments.author')
	.then(dish => {
		if (dish != null) {
			res.status(200);
			res.setHeader('content-type', "application/json");
			res.json(dish.comments);

		}
		else {
			var err = new Error('Dish ' + req.params.dishId + " not found");
			err.status = 404;
			return next(err);
		}
	}).catch(err => next(err))	
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.then(dish => {
		if (dish != null) {
			req.body.author = req.user._id;
			dish.comments.push(req.body);
			dish.save()
			.then(dish => {
				dish.populate('comments.author').then(dish => {
					res.status(200);
					res.setHeader('content-type', "application/json");
					res.json(dish);
					
				});
			}).catch(err => next(err));
		}
		else {
			var err = new Error('Dish ' + req.params.dishId + " not found");
			err.status = 404;
			return next(err);
		}
	}).catch(err => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	var err = new Error('PUT operation not supported on /dishes/:dishId/comments.');
	err.status = 403;
	return next(err);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.then(dish => {
		if (dish != null) {
			for (var i = dish.comments.length - 1; i>=0; i--) {
				dish.comments.id(dish.comments[i]._id).remove();
			}
			dish.save()
			.then(dish => {
				res.status(200);
				res.setHeader('content-type', "application/json");
				res.json(dish);
			})
		}
		else {
			var err = new Error('Dish ' + req.params.dishId + " not found");
			err.status = 404;
			return next(err);
		}
	}).catch(err => next(err))
});


//--------------------------------------------------------


dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.populate('comments.author')
	.then(dish => {
		if (dish != null && dish.comments.id(req.params.commentId) != null) {
			res.status(200);
			res.setHeader('content-type', "application/json");
			res.json(dish.comments.id(req.params.commentId));
		} else if (dish === null) {
			err = new Error('Dish ' + req.params.dishId + " not found");
			err.status = 404;
			return next(err);
		} else {
			err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
		}
		
	}).catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.setHeader('content-type', 'text/plain')
	res.end('Post request not supported on /dishes/:dishId/comments/:commentId');
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.then(dish => {
		var commentID = req.params.commentId;
		var comment = dish.comments.id(commentID);
		
		if (dish != null && dish.comments.id(commentID) != null) {
			if (req.user._id.equals(comment.author)) {
				if (req.body.rating) {
					dish.comments.id(commentID).rating = req.body.rating;
				}
				if (req.body.comment) {
					dish.comments.id(commentID).comment = req.body.comment;
				}
				dish.save()
				.then(dish => {
					dish.populate('comments.author').then(err => {
						res.status(200);
						res.setHeader('content-type', "application/json");
						res.json(dish);
	
					}).catch(err => next(err));
				});
			} else {
				var err = new Error('Users cannot update comments posted by other users');
				err.status = 403;
				return next(err);
			}

		} else if (dish === null) {
			err = new Error('Dish ' + req.params.dishId + " not found");
			err.status = 404;
			return next(err);
		} else {
			err = new Error('Comment ' + commentID + ' not found');
            err.status = 404;
            return next(err);
		}
	}).catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.then(dish => {

		if (dish != null && dish.comments.id(req.params.commentId) != null) {
			
			if (req.user._id.equals(dish.comments.id(req.params.commentId).author)) {
				dish.comments.id(req.params.commentId).remove();
				dish.save()
				.then(dish => {
					dish.populate('comments.author')
					.then(dish => {
						res.status(200);
						res.setHeader('content-type', "application/json");
						res.json(dish);
					}).catch(err => next(err));
				});
			} else {
				var err = new Error('Users cannot delete comments posted by other users');
				err.status = 403;
				return next(err);
			}
			
		} else if (dish === null) {
			err = new Error('Dish ' + req.params.dishId + " not found");
			err.status = 404;
			return next(err);
		} else {
			err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
		}
		
	}).catch(err => next(err));
});


module.exports = dishRouter;