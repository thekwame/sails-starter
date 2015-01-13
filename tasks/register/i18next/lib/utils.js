var glob = require('glob'),
  async = require('async'),
  path = require('path'),
  fs = require('fs'),
  _ = require('lodash');

/**
 * Find all files in the given set of target directories, according to
 * the globbing pattern. Directories themselves are not returned
 *
 * @param targets
 * @param pattern
 * @param done
 * @private
 */
exports.glob = function (targets, pattern, options, done) {
  if (typeof options === 'function') {
    done = options;
    options = {};
  }

  if (typeof pattern !== 'string') {
    return done(new Error('Glob pattern must be a string, %s', pattern));
  }

  var globs = [];

  if (targets) {

    targets = (_.isArray(targets)) ? targets : [targets];

    targets.forEach(function (dir) {
      if (dir) {
        dir = path.resolve(dir, pattern);
        globs.push(function (next) {
          glob(dir, {
            strict: true
          }, next);
        });
      }
    });

    // Run all the globs and prepare a single object to return
    async.parallel(globs, function (err, results) {
      results = _.isArray(results) ? results : [];
      results = _.flatten(results);

      // Remove any directories
      if (!options.includeAll) {
        results = results.filter(function (result) {
          return fs.statSync(result).isFile();
        });
      }

      done(err, results);
    });
  } else {
    done(undefined, []);
  }
};
