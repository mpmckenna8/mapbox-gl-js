'use strict';
var test = require('tape').test;

var Buffer = require('../../../js/data/buffer/buffer.js'),
    FillElementsBuffer = require('../../../js/data/buffer/fillelementsbuffer.js');

test('FillElementsBuffer', function(t) {
    var buf = new Buffer();
    t.ok(new FillElementsBuffer(buf), 'default buffer');
    var fillElems = new FillElementsBuffer(buf);
    fillElems.setupViews();
    t.equal(fillElems.itemSize, 6);
    t.equal(fillElems.arrayType, 'ELEMENT_ARRAY_BUFFER');
    t.equal(fillElems.add(0, 0, 0), undefined);
    t.equal(fillElems.pos, 6);
    t.end();
});
