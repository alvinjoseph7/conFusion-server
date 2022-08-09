const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will get all the leaders. Leaders.... assemble.');
})
.post((req, res, next) => {
    res.end('Will add leader with name ' + req.body.name);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
    res.end('Deleting all leader information');
});


leaderRouter.route('/:leaderId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will get leader with leaderId ' + req.params.leaderId);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Post request not supported on /leaders/:leaderId');
})
.put((req, res, next) => {
    res.write('Updating leader with leaderId: ' + req.params.leaderId);
    res.end('\nWill modify with leader name ' + req.body.name);
})
.delete((req, res, next) => {
    res.end('Will delete leader with id: ' + req.params.leaderId);
});

module.exports = leaderRouter;