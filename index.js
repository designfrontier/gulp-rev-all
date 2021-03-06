var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var tools = require('./tools');
var through = require('through2');
var chalk = require('chalk');
var gutil = require('gulp-util');

module.exports = function(optionsIn) {

    var options = optionsIn || {};
    var first = true;

    if(typeof options.hashLength === 'undefined'){
        options.hashLength = 8;
    }

    return through.obj(function (file, enc, callback) {

        if (options.rootDir === undefined) options.rootDir = file.base;

        if (first) {
            gutil.log('gulp-rev-all:', 'Root directory [', options.rootDir, ']');
            first = !first;
        }


        if (file.isNull()) {
            callback(null, file);
            return;
        } else if (file.isStream()) {
            throw new Error('Streams are not supported!');
            callback(null, file);
            return;
        } 

        // Only process references in these types of files, otherwise we'll corrupt images etc
        switch(path.extname(file.path)) {
            case '.js':
            case '.css':
            case '.html':
                tools.revReferencesInFile(file, options);
        }

        var filenameReved = path.basename(tools.revFile(file.path, options));
        var base = path.dirname(file.path);        
        file.path = path.join(base, filenameReved);

        callback(null, file);

    });


};
