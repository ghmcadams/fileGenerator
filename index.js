#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var program = require('commander');
var ejs = require('ejs');
var moment = require('moment');
var ejsLint = require('ejs-lint');

const env = process.env;

const programUsage = '<source> <template> <output> [options...]';
program
  .version('1.0.0')
  .description('File Generator')
  .usage(programUsage)
  .arguments(programUsage)

  .on('--help', function() {
    console.log('  Arguments:');
    console.log();
    console.log('    source:    The path to the JSON file containing the source data');
    console.log('    template:  The path to the template file');
    console.log('    output:    The path to the output file');
    console.log('    options:   Optional properties for use in your template');
    console.log('                  format: key=value');
    console.log('                  value can be boolean, integer, or string');
    console.log('                  if value is omitted, value is defaulted to true (boolean)');
    console.log('                  values that contain spaces must be put inside quotes');
    console.log('                  examples:');
    console.log('                     processItems                // true');
    console.log('                     processItems=true           // true');
    console.log('                     processItems=false          // false');
    console.log('                     itemId=42                   // 42');
    console.log('                     itemCode=condor             // "condor"');
    console.log('                     userName="Gabriel McAdams"  // "Gabriel McAdams"');
    console.log();
    console.log('  Additional template properties:');
    console.log();
    console.log('    $: {');
    console.log('      me:      The name of the user running the script');
    console.log('      today:   Today\'s date (formatted as MM/DD/YYYY)');
    console.log('      options: An object containing the options specified above');
    console.log('    }');
    console.log();
  })

  .action(function(source, template, output, options) {
    // Locate files
    var sourcePath = path.resolve(source);
    var templatePath = path.resolve(template);
    var outputPath = path.resolve(output);

    // Validate paths
    if (!fs.existsSync(sourcePath)) {
      console.log('source path does not exist.');
      process.exit(1);
    }
    if (!fs.existsSync(templatePath)) {
      console.log('template path does not exist.');
      process.exit(1);
    }
    if (!fs.existsSync(path.dirname(outputPath))) {
      console.log('output folder does not exist.');
      process.exit(1);
    }

    // Read files
    var sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    var templateContent = fs.readFileSync(templatePath, 'utf8');

    // Ensure no property is a dollar sign ($)
    Object.keys(sourceData).forEach(function(key) {
      if (key === '$') {
        console.log('source properties must not be named "$"');
        process.exit(1);
      }
    });

    // Add additional template properties
    sourceData.$ = {
      me: env.GIT_AUTHOR_NAME || env.GIT_COMMITTER_NAME || env.SUDO_USER || env.LOGNAME || env.USER || env.LNAME || env.USERNAME || '**UNKNOWN**',
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

    // Validate template
    var lintError = ejsLint.lint(templateContent, {});
    if (lintError) {
          console.log('Template Error: ');
          console.log(lintError);
      process.exit(1);
    }

    // Generate output
    var output = ejs.render(templateContent, sourceData);

    // Write output to file
    fs.writeFile(outputPath, output, function(err) {
      if (err) {
        console.log(err);
        process.exit(1);
      } else {
        console.log("File generated successfully.");
        process.exit(0);
      }
    });
  })

  .parse(process.argv);


// If no arguments were specified, display help
if (!program.args.length) {
  program.help();
}
