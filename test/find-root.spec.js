'use strict';

var exec = require('child_process').exec;
var expect = require('chai').expect;
var moquire = require('moquire');

describe('lib: find-root', function () {
    it('should search for package.json when called with no param', function (done) {
        var fs = {
          existsSync: function (path) {
            return path === '/foo/package.json';
          }
        };

        var findRoot = moquire('../lib/find-root', {fs: fs});
        var result = findRoot('/foo');

        expect(result).to.exist;
        expect(result).to.equal('/foo');
        done();
    });

    it('should search for filename', function (done) {
        var fs = {
          existsSync: function (path) {
            return path === '/foo/file.json';
          }
        };

        var findRoot = moquire('../lib/find-root', {fs: fs});
        var result = findRoot('/foo', 'file.json');

        expect(result).to.exist;
        expect(result).to.equal('/foo');
        done();
    });

    it('should search recursively', function (done) {
        var checked = [];
        var fs = {
          existsSync: function (path) {
            checked.push(path);
            return path === '/foo/file.json';
          }
        };
        var paths = [
            '/foo/bar/baz/file.json',
            '/foo/bar/file.json',
            '/foo/file.json'
        ];

        var findRoot = moquire('../lib/find-root', {fs: fs});
        var result = findRoot('/foo/bar/baz', 'file.json');

        expect(result).to.exist;
        expect(result).to.equal('/foo');
        expect(checked).to.deep.equal(paths);
        done();
    });

    it('should throw error when no such file exists', function (done) {
        var fs = {
          existsSync: function (path) {
            return false;
          }
        };

        var findRoot = moquire('../lib/find-root', {fs: fs});

        expect(function() {
            findRoot('/foo/bar');
        }).to.throw(/not found/);
        done();
    });
});