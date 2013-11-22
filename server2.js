var path = require('path');
var express = require('express');
var loadTile = require('./topo/load.js');


var app = express();

app.use(express.compress());

app.get('/gl/tiles/:z(\\d+)-:x(\\d+)-:y(\\d+).vector.pbf', function(req, res) {
    var x = req.params.x, y = req.params.y, z = req.params.z;

    loadTile(z, x, y, function(err, compressed) {
        if (err) {
            console.error(err.stack);
            res.send(500, err.message);
        } else {
            res.setHeader('Expires', new Date(Date.now() + 86400000).toUTCString());
            res.setHeader('Cache-Control', 'public; max-age=86400');
            res.setHeader('Content-Type', 'application/x-vectortile');
            res.setHeader('Content-Encoding', 'deflate');
            res.setHeader('Content-Length', compressed.length);
            res.send(200, compressed);
        }
    });
});

app.use('/debug', express.static(__dirname + '/debug'));
app.use('/editor', express.static(__dirname + '/editor'));
app.use('/dist', express.static(__dirname + '/dist'));

app.get('/', function(req, res) {
    res.redirect('/debug/');
});

app.listen(3333);
console.log('Listening on port 3333');
