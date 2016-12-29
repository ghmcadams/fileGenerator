File Generator
===============

A Node.js based Command Line Interface (CLI) that generates a file based on a template and a JSON file

[![NPM](https://nodei.co/npm/filegenerator.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/filegenerator/)

## Installation

    $ npm install filegenerator -g


## Usage

    $ filegenerator <source> <template> <output> [options...]

- source:    The path to the JSON file containing the source data
- template:  The path to the ejs template file
- output:    The path to output the resulting file
- options:   Optional properties for use in your template
```
        format: key=value
        value can be boolean, integer, or string
        if value is omitted, value is defaulted to true (boolean)
        values that contain spaces must be put inside quotes

        examples:
            processItems                // true
            processItems=true           // true
            processItems=false          // false
            itemId=42                   // 42
            itemCode=condor             // "condor"
            userName="Gabriel McAdams"  // "Gabriel McAdams"
```

- Additional template properties:

```
$: {
    me:      The name of the user running the script
    today:   Today's date (formatted as MM/DD/YYYY)
    options: An object containing the options specified above
}
```

    $ npm run example

(see example folder for a full example of usage)

## License

(The MIT License)

Copyright (c) 2016 Gabriel McAdams &lt; ghmcadams@yahoo.com &gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.