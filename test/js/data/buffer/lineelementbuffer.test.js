'use strict';
var test = require('tape').test;

var Buffer = require('../../../js/data/buffer/buffer.js'),
    LineElementBuffer = require('../../../js/data/buffer/lineelementbuffer.js');

test('LineElementBuffer', function(t) {
    var buf = new Buffer();
    t.ok(new LineElementBuffer(buf), 'default buffer');
    var lineElems = new LineElementBuffer(buf);
    lineElems.setupViews();
    t.equal(lineElems.itemSize, 6);
    t.equal(lineElems.arrayType, 'ELEMENT_ARRAY_BUFFER');
    t.equal(lineElems.add(0, 0, 0), undefined);
    t.equal(lineElems.pos, 6);
    t.end();
});
