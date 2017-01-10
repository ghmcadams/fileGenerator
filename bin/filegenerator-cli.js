#!/usr/bin/env node

var program = require('commander');
var generate = require('../lib/filegenerator.js');

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
    generate(source, template, output, options, function(err) {
      if (err) {
        console.log(err.message);
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
