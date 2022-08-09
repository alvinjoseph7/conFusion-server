const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all the dishes to you!');
})
.post((req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.desc);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all dishes');
});

dishRouter.route('/:dishId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will get dish with dishId ' + req.params.dishId);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Post request not supported on /dishes/:dishId');
})
.put((req, res, next) => {
    res.write('Updating dish with dishId: ' + req.params.dishId);
    res.end('\nWill modify with dish name ' + req.body.name + ' with details: ' + req.body.desc);
})
.delete((req, res, next) => {
    res.end('Will delete dish with id: ' + req.params.dishId);
});

module.exports = dishRouter;

