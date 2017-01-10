var os = require('os');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var moment = require('moment');
var ejsLint = require('ejs-lint');
var ini = require('node-ini');

const env = process.env;

module.exports = function(source, template, output, options, callback) {
  // Locate files
  var sourcePath = path.resolve(source);
  var templatePath = path.resolve(template);
  var outputPath = path.resolve(output);

  // Validate paths
  if (!fs.existsSync(sourcePath)) {
    return callback(new Error('source path does not exist'));
  }
  if (!fs.existsSync(templatePath)) {
    return callback(new Error('template path does not exist'));
  }
  if (!fs.existsSync(path.dirname(outputPath))) {
    return callback(new Error('output folder does not exist'));
  }

  // Read files
  var sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  var templateContent = fs.readFileSync(templatePath, 'utf8');

  // Ensure no property is a dollar sign ($)
  Object.keys(sourceData).forEach(function(key) {
    if (key === '$') {
      return callback(new Error('source properties must not be named "$"'));
    }
  });

  // Validate template
  var lintError = ejsLint.lint(templateContent, {});
  if (lintError) {
    return callback(new Error('Template Error: ' + lintError));
  }

  // Add additional template properties

  // Get git user name
  var gitUserName;
  try {
    gitUserName = ini.parseSync(path.join(os.homedir(), '.gitconfig')).user.name;
  } catch (e) {}

  sourceData.$ = {
    me: gitUserName || env.GIT_AUTHOR_NAME || env.GIT_COMMITTER_NAME || env.HGUSER || env.C9_USER || env.SUDO_USER || env.LOGNAME || env.USER || env.LNAME || env.USERNAME || '**UNKNOWN**',
    today: moment().format('MM/DD/YYYY'),
    options: {}
  };

  options.forEach(function (option) {
    var parts = option.split('=');
    var key = parts[0];
    var value;

    if (parts.length === 1) {
      value = true;
    } else if (parts[1].toLowerCase() === 'true') {
      value = true;
    } else if (parts[1].toLowerCase() === 'false') {
      value = false;
    } else  if (!isNaN(parseInt(parts[1], 10))) {
      value = parseInt(parts[1], 10);
    } else {
      value = parts[1];
    }

    sourceData.$.options[key] = value;
  });

  // Generate output
  var output;
  try {
    output = ejs.render(templateContent, sourceData);
  } catch(e) {
    return callback(e);
  }

  // Write output to file
  fs.writeFile(outputPath, output, function(err) {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};
