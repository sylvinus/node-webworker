// Verify that we can spawn a worker, send and receive a simple message, and
// kill it.

var assert = require('assert');
var path = require('path');
var sys = require('sys');
var Worker = require('webworker').Worker;

var w = new Worker(path.join(__dirname, 'workers', 'simple.js'));

w.onmessage = function(e) {
    assert.ok('data' in e);
    assert.equal(e.data.bar, 'foo');
    assert.equal(e.data.bunkle, 'baz');

    w.terminate();
    process.exit(0);
};

w.postMessage({'foo' : 'bar', 'baz' : 'bunkle'});