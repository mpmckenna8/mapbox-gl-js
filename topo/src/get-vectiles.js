var async = require('async');
var getVectile = require('./get-vectile.js');

module.exports = function(z, x, y, callback) {
    var names =  ['road',     'labels',    'buildings', 'landusage',   'water',       'poi'];
    var layers = ['highroad', 'skeletron', 'buildings', 'land-usages', 'water-areas', 'pois'];
    async.map(layers, function(layer, callback) {
        getVectile(layer, 'topojson', z, x, y, callback);
    }, function(err, results) {
        if (err) return callback(err);
        var object = {};
        for (var i = 0; i < layers.length; i++) {
            object[names[i]] = results[i];
        }
        callback(null, object);
    });
};
