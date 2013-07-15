#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2

 + restler
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var sys = require('util');
var rest = require('restler');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";


var assertFileExists = function(infile) {
  var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var checkUrlFile = function(url, checksfile){
	if(url){
		rest.get(url).on('complete', function(data, response) {
  			if (data instanceof Error) {
    				console.log('Get request failed');
				process.exit(1);

 			} else {
    				//url exists - read file
				testfile(response.raw, checksfile);
    			}
		});	
	}
};


var checkHtmlFile = function(htmlfile, checksfile) {
	fs.readFile(htmlfile, function(err, data){
	if(err) {
		console.log('Error reading HTML file');
		process.exit(1);
	} else {
		testfile(data, checksfile);
	}
    });
};


var testfile = function(html, checksfile){
	fs.readFile(checksfile, function(err, data){
                         if(err) {
				console.log('Couldn\'t read checks file');
                                process.exit(1);
                        } else {
                   		$ = cheerio.load(html);
             
				var checks = JSON.parse(data).sort();
                                var out = {};
                                for(var ii in checks) {
                                         var present = $(checks[ii]).length > 0;
                                        out[checks[ii]] = present;
                                }
                                processJSON(out);
                        }
                });
};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};



var processJSON = function(j){
 	var outJson = JSON.stringify(j, null, 4);
    	console.log(outJson);
};


if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <html_url>', 'Url of index.html')
	.parse(process.argv);

	
	if(program.url) {		
		checkUrlFile(program.url, program.checks);
	}else if(program.file) {
		checkHtmlFile(program.file, program.checks);   
	}else {
          	console.log('No file provided');
	} 

} else {
    exports.checkHtmlFile = checkHtmlFile;
};
