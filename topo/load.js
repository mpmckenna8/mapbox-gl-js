var util = require('util');
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var mkdirp = require('mkdirp');

var getVectiles = require('./src/get-vectiles.js');
var processTile = require('./src/process-tile.js');

module.exports = function(z, x, y, callback) {
    var folder = path.join('cache', (x % 16).toString(16) + (y % 16).toString(16));
    var existing = path.join(folder, z + '-' + x + '-' + y + '.vector.pbf');

    fs.readFile(existing, function(err, compressed) {
        if (err) {
            mkdirp(folder, function(err) {
                if (err) return callback(err);

                getVectiles(z, x, y, function(err, layers) {
                    if (err) return callback(err);

                    var data = processTile(z, x, y, layers);
                    zlib.deflate(data, function(err, compressed) {
                        if (err) return callback(err);

                        fs.writeFile(existing, compressed, function(err) {
                            if (err) return callback(err);

                            callback(null, compressed);
                        });
                    });
                });
            });
        } else {
            callback(null, compressed);
        }
    });
};
