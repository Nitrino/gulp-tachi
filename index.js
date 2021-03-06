var _         = require('lodash');
var map       = require('map-stream');
var preproc   = require('preprocess');
var path      = require('path');

module.exports = function (options) {
  var opts    = _.merge({}, options);
  var context = _.merge({}, process.env, opts.context);

  function abReplace(file, callback) {
    var contents, extension;

    if (file.isNull()) return callback(null, file);
    if (file.isStream()) return callback(new Error("gulp-ab-test: Streaming not supported"));

    context.src = file.path;
    context.srcDir = opts.includeBase || path.dirname(file.path);

    extension = _.isEmpty(opts.extension) ? getExtension(context.src) : opts.extension;

    contents = file.contents.toString('utf8');
    if (extension == 'slim') extension = 'js';
    contents = preproc.preprocess(contents, context, extension);
    file.contents = new Buffer(contents);

    callback(null, file);
  }

  return map(abReplace);
};

function getExtension(filename) {
  var ext = path.extname(filename||'').split('.');
  return ext[ext.length - 1];
}