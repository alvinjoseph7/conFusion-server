const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all the promotions to you!');
})
.post((req, res, next) => {
    res.end('Will add the promotions: ' + req.body.name + ' with details: ' + req.body.desc);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all promotions');
});


promoRouter.route('/:promoId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will get promotion with promoId ' + req.params.promoId);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Post request not supported on /promotions/:promoId');
})
.put((req, res, next) => {
    res.write('Updating promotion with promoId: ' + req.params.promoId);
    res.end('\nWill modify with promotion name ' + req.body.name + ' with details: ' + req.body.desc);
})
.delete((req, res, next) => {
    res.end('Will delete promotion with id: ' + req.params.promoId);
});

module.exports = promoRouter;
