'use strict';

var ieee754 = require('./ieee754.js');

module.exports = ProtobufWritable;
function ProtobufWritable(length) {
    this.buf = new Buffer(length || 1024);
    this.length = this.buf.length;
    this.pos = 0;
}


ProtobufWritable.Varint = 0;
ProtobufWritable.Int64 = 1;
ProtobufWritable.Message = 2;
ProtobufWritable.String = 2;
ProtobufWritable.Packed = 2;
ProtobufWritable.Int32 = 5;


ProtobufWritable.prototype.realloc = function(required) {
    if (this.pos + required >= this.buf.length) {
        var add = Math.ceil(required / 1024) * 1024;
        var buf = new Buffer(this.buf.length + add);
        this.buf.copy(buf);
        this.buf = buf;
        this.length = this.buf.length;
    }
};

ProtobufWritable.prototype.finish = function() {
    return this.buf.slice(0, this.pos);
};

ProtobufWritable.prototype.writeTag = function(tag, type) {
    this.writeVarint((tag << 3) | type);
};

ProtobufWritable.prototype.writeVarint = function(val) {
    if (val <= 0x7f) {
        this.realloc(1);
        this.buf[this.pos++] = val;
    } else if (val <= 0x3fff) {
        this.realloc(2);
        this.buf[this.pos++] = 0x80 | ((val >> 0) & 0x7f);
        this.buf[this.pos++] = ((val >> 7) & 0x7f);
    } else if (val <= 0x1ffffff) {
        this.realloc(3);
        this.buf[this.pos++] = 0x80 | ((val >> 0) & 0x7f);
        this.buf[this.pos++] = 0x80 | ((val >> 7) & 0x7f);
        this.buf[this.pos++] = ((val >> 14) & 0x7f);
    } else if (val <= 0xfffffff) {
        this.realloc(4);
        this.buf[this.pos++] = 0x80 | ((val >> 0) & 0x7f);
        this.buf[this.pos++] = 0x80 | ((val >> 7) & 0x7f);
        this.buf[this.pos++] = 0x80 | ((val >> 14) & 0x7f);
        this.buf[this.pos++] = ((val >> 21) & 0x7f);
    } else if (val <= 0x7FFFFFFFF) {
        // TODO: This fails in JS
        this.realloc(5);
        this.buf[this.pos++] = 0x80 | ((val >> 0) & 0x7f);
        this.buf[this.pos++] = 0x80 | ((val >> 7) & 0x7f);
        this.buf[this.pos++] = 0x80 | ((val >> 14) & 0x7f);
        this.buf[this.pos++] = 0x80 | ((val >> 21) & 0x7f);
        this.buf[this.pos++] = ((val >> 28) & 0x7f);
    } else {
        throw new Error("TODO: Handle 6+ byte varints (" + val + ")");
    }
};

ProtobufWritable.prototype.writeSVarint = function(val) {
    this.writeVarint((val << 1) ^ (val >> 31));
}

ProtobufWritable.prototype.writeTaggedVarint = function(tag, val) {
    this.writeTag(tag, ProtobufWritable.Varint);
    this.writeVarint(val);
};


ProtobufWritable.prototype.writeTaggedSVarint = function(tag, val) {
    this.writeTag(tag, ProtobufWritable.Varint);
    this.writeSVarint(val);
};

ProtobufWritable.prototype.writePackedVarints = function(tag, items) {
    if (!items.length) return;

    // Count length.
    var bytes = 0;
    for (var i = 0; i < items.length; i++) {
        var val = items[i];
        bytes += val <= 0x7f ? 1 : val <= 0x3fff ? 2 : val <= 0x1ffffff ? 3 : val <= 0xfffffff ? 4 : val <= 0x7ffffffff ? 5 : 6;
    }
    this.writeTag(tag, ProtobufWritable.Message);
    this.writeVarint(bytes);
    this.realloc(bytes);
    for (var i = 0; i < items.length; i++) {
        this.writeVarint(items[i]);
    }
};

ProtobufWritable.prototype.writeMessage = function(tag, protobuf) {
    var buffer = protobuf.finish();
    this.writeTag(tag, ProtobufWritable.Message);
    this.writeBuffer(buffer);
};

ProtobufWritable.prototype.writeBuffer = function(buffer) {
    var bytes = buffer.length;
    this.writeVarint(bytes);
    this.realloc(bytes);
    buffer.copy(this.buf, this.pos);
    this.pos += bytes;
};

ProtobufWritable.prototype.writeString = function(str) {
    str = String(str);
    var bytes = Buffer.byteLength(str);
    this.writeVarint(bytes);
    this.realloc(bytes);
    this.buf.write(str, this.pos);
    this.pos += bytes;
};

ProtobufWritable.prototype.writeTaggedString = function(tag, str) {
    this.writeTag(tag, ProtobufWritable.String);
    this.writeString(str);
};

ProtobufWritable.prototype.writeBoolean = function(val) {
    this.writeVarint(Boolean(val));
};

ProtobufWritable.prototype.writeTaggedBoolean = function(tag, val) {
    this.writeTaggedVarint(Boolean(val));
};

ProtobufWritable.prototype.writeDouble = function(val) {
    this.realloc(8);
    this.buf.writeDoubleLE(val, this.pos);
    this.pos += 8;
};

ProtobufWritable.prototype.writeTaggedDouble = function(tag, val) {
    this.writeTag(tag, ProtobufWritable.Int64);
    this.writeDouble(val);
};
