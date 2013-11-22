var path = require('path');
var fs = require('fs');
var zlib = require('zlib');
var mkdirp = require('mkdirp');
var request = require('request');

module.exports = function(type, format, z, x, y, callback) {
    var folder = path.join('cache', (x % 16).toString(16) + (y % 16).toString(16));
    var existing = path.join(folder, type + '-' + z + '-' + x + '-' + y + '.' + format + '.gz');

    fs.readFile(existing, function(err, compressed) {
        if (err) {
            mkdirp(folder, function(err) {
                if (err) return callback(err);

                var url = 'http://tile.openstreetmap.us/vectiles-' + type + '/' + z + '/' + x + '/' + y + '.' + format;
                request(url, function(err, res, uncompressed) {
                    if (err) return callback(err);

                    if (res.statusCode === 200) {
                        zlib.gzip(uncompressed, function(err, compressed) {
                            if (err) return callback(err);

                            fs.writeFile(existing, compressed, function(err) {
                                if (err) return callback(err);

                                var data = JSON.parse(uncompressed);
                                callback(null, data);
                            });
                        });
                    } else {
                        callback(new Error('Did not expect status code ' + res.statusCode));
                    }
                });
            });
        } else {
            zlib.gunzip(compressed, function (err, uncompressed) {
                if (err) return callback(err);
                var data = JSON.parse(uncompressed);
                callback(null, data);
            });
        }
    });
};
