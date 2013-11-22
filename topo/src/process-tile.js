var topojson = require('topojson');
var merc = new (require('sphericalmercator'))({ size: 4096 });
var ProtobufWritable = require('./protobuf_writable.js');

module.exports = function(z, x, y, layers) {
    var bbox = merc.bbox(x, y, z);
    var origin = merc.px([bbox[0], bbox[3]], z);

    var pbf_tile = new ProtobufWritable();

    for (var layer_name in layers) {
        var layer = layers[layer_name];

        // layer.transform.translate[0] -= bbox[0];
        // layer.transform.translate[1] -= bbox[1];
        // layer.transform.scale[0] = 4;
        // layer.transform.scale[1] = 4;
        var data = topojson.feature(layer, layer.objects.vectile);

        var pbf_layer = new ProtobufWritable();
        pbf_layer.writeTaggedVarint(15 /* version */, 1);
        pbf_layer.writeTaggedString(1 /* name */, layer_name);
        pbf_layer.writeTaggedVarint(5 /* extent */, 4096);

        var keys = [];
        var vals = [];

        for (var i = 0; i < data.features.length; i++) {
            var feature = data.features[i];
            var geometry = feature.geometry;
            var properties = feature.properties;

            var pbf_type = mapType[geometry.type];

            // Encode the properties.
            var pbf_tags = [];
            for (var key in properties) {
                if (key == 'area' || key == 'source') continue;

                var key_idx = keys.indexOf(key);
                var val_idx = vals.indexOf(properties[key]);
                if (key_idx < 0) {
                    key_idx = keys.length;
                    keys[key_idx] = key;
                    pbf_layer.writeTaggedString(3 /* key */, key);
                }
                if (val_idx < 0) {
                    val_idx = vals.length;
                    vals[val_idx] = properties[key];
                    var val = properties[key];
                    if (val === 'no') val = false;
                    if (val === 'yes') val = true;
                    pbf_layer.writeMessage(4 /* value */, processValue(val));
                }
                pbf_tags.push(key_idx, val_idx);
            }

            var pbf_geometry = processGeometry(geometry, z, origin);

            var pbf_feature = new ProtobufWritable();
            pbf_feature.writeTaggedVarint(3 /* type */, pbf_type);
            pbf_feature.writePackedVarints(2 /* tags */, pbf_tags);
            pbf_feature.writePackedVarints(4 /* geometry */, pbf_geometry);

            pbf_layer.writeMessage(2 /* feature */, pbf_feature);
        }

        pbf_tile.writeMessage(3 /* layer */, pbf_layer);
    }

    return pbf_tile.finish();
};


var mapType = {
    MultiPolygon: 3,
    Polygon: 3,
    MultiLineString: 2,
    LineString: 2,
    MultiPoint: 1,
    Point: 1
};

function processValue(value) {
    var pbf_value = new ProtobufWritable();

    if (typeof value == 'number') {
        // TODO: Better type detection so we write the shortest type.
        if (Math.round(value) === value) {
            if (value >= 0) {
                pbf_value.writeTaggedVarint(4, value);
            } else {
                pbf_value.writeTaggedSVarint(6, value);
            }
        } else {
            pbf_value.writeTaggedDouble(3, value);
        }
    } else if (typeof value == 'boolean') {
        pbf_value.writeTaggedVarint(4, value);
    } else if (value == null) {
        // noop
    } else {
        pbf_value.writeTaggedString(1, value);
    }

    return pbf_value;
}

function processGeometry(geometry, zoom, origin) {
    var pos = { x: 0, y: 0 };
    var points = [];

    switch (geometry.type) {
        case 'MultiPolygon':
            for (var i = 0; i < geometry.coordinates.length; i++) {
                processPolygon(geometry.coordinates[i], points, pos, zoom, origin);
            }
            break;
        case 'Polygon':
            processPolygon(geometry.coordinates, points, pos, zoom, origin);
            break;
        case 'MultiLineString':
            for (var i = 0; i < geometry.coordinates.length; i++) {
                processLineString(geometry.coordinates[i], points, pos, zoom, origin);
            }
            break;
        case 'LineString':
            processLineString(geometry.coordinates, points, pos, zoom, origin);
            break;
        case 'MultiPoint':
            for (var i = 0; i < geometry.coordinates.length; i++) {
                processPoint(geometry.coordinates[i], points, pos, zoom, origin);
            }
            break;
        case 'Point':
            processPoint(geometry.coordinates, points, pos, zoom, origin);
            break;
        default:
            throw new Error('unhandled type ' + points.type);
    }

    return points;
}

function processPoint(coord, geometry, pos, zoom, origin) {
    coord = merc.px(coord, zoom);
    coord[0] -= origin[0]; coord[1] -= origin[1];

    var dx, dy;
    /* moveTo  */ geometry.push((1 << 3) | 1);
    /* delta x */ pos.x += (dx = coord[0] - pos.x);
    /* delta y */ pos.y += (dy = coord[1] - pos.y);
    /* zigzag  */ geometry.push((dx << 1) ^ (dx >> 31), (dy << 1) ^ (dy >> 31));
}

function processLineString(coords, geometry, pos, zoom, origin) {
    var dx, dy;
    /* moveTo  */ geometry.push((1 << 3) | 1);

    var coord = coords[0];
    coord = merc.px(coord, zoom);
    coord[0] -= origin[0]; coord[1] -= origin[1];

    /* delta x */ pos.x += (dx = coord[0] - pos.x);
    /* delta y */ pos.y += (dy = coord[1] - pos.y);
    /* zigzag  */ geometry.push((dx << 1) ^ (dx >> 31), (dy << 1) ^ (dy >> 31));

    /* lineTo  */ geometry.push(((coords.length - 1) << 3) | 2);
    for (var i = 1; i < coords.length; i++) {
        coord = coords[i];
        coord = merc.px(coord, zoom);
        coord[0] -= origin[0]; coord[1] -= origin[1];
        /* delta x */ pos.x += (dx = coord[0] - pos.x);
        /* delta y */ pos.y += (dy = coord[1] - pos.y);
        /* zigzag  */ geometry.push((dx << 1) ^ (dx >> 31), (dy << 1) ^ (dy >> 31));
    }
}

function processPolygon(rings, geometry, pos, zoom, origin) {
    var dx, dy;
    for (var i = 0; i < rings.length; i++) {
        var ring = rings[i];

        /* moveTo  */ geometry.push((1 << 3) | 1);

        var coord = ring[0];
        coord = merc.px(coord, zoom);
        coord[0] -= origin[0]; coord[1] -= origin[1];

        /* delta x */ pos.x += (dx = coord[0] - pos.x);
        /* delta y */ pos.y += (dy = coord[1] - pos.y);
        /* zigzag  */ geometry.push((dx << 1) ^ (dx >> 31), (dy << 1) ^ (dy >> 31));

        /* lineTo  */ geometry.push(((ring.length - 2) << 3) | 2);
        for (var j = 1; j < ring.length - 1; j++) {
            coord = ring[j];
            coord = merc.px(coord, zoom);
            coord[0] -= origin[0]; coord[1] -= origin[1];
            /* delta x */ pos.x += (dx = coord[0] - pos.x);
            /* delta y */ pos.y += (dy = coord[1] - pos.y);
            /* zigzag  */ geometry.push((dx << 1) ^ (dx >> 31), (dy << 1) ^ (dy >> 31));
        }
        /* close  */ geometry.push((1 << 3) | 7);
    }
}