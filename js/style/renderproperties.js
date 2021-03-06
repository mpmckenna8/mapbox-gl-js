'use strict';

var reference = require('mapbox-gl-style-spec/reference/v4');

module.exports = {};

reference.render.forEach(function(className) {
    var Properties = function(props) {
        for (var p in props) {
            this[p] = props[p];
        }
    };

    var properties = reference[className];
    for (var prop in properties) {
        if (properties[prop]['default'] === undefined) continue;
        Properties.prototype[prop] = properties[prop]['default'];
    }
    module.exports[className.replace('render_','')] = Properties;
});

