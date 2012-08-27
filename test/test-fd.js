// Verify that we can send and receive a file descriptor.

console.error("test-fd is not working anymore, please fix!");
process.exit(1);

var assert = require('assert');
var net = require('net');
var path = require('path');
var sys = require('sys');
var fs = require("fs");
var stream = require('stream');
var Worker = require('../lib/webworker').Worker;

var w = new Worker(path.join(__dirname, 'workers', 'fd.js'));

var fd = fs.openSync("/tmp/webworker.fdtest","w+");

var s = new net.Stream(fd);
s.resume();

var receivedData = false;
s.addListener('data', function(d) {
	console.log("stream data",d);
    var o = JSON.parse(d.toString('utf8'));

    assert.equal(o.grumpy, 'frumpy');

    receivedData = true;
    s.destroy();
    w.terminate();

    process.exit(0);
});

console.log("send",fd);
w.postMessage({ 'grumpy' : 'frumpy' }, fd);

process.addListener('exit', function() {
    assert.equal(receivedData, true);
    console.log("Final exit");
});
