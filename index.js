var 
	OMetaJS = require('ometa-js'),
	OMeta = OMetaJS.core,
	fs = require('fs')

var testString = '# Big Header\n\
## Sub Headen\n\
### Sub Sub Header\n\
\n\
This *is a* paragraph, _really_. You must\n\
use **double** new lines to separate\n\
the paragraphs\n\
\n\
like this.\n'

init()

function init(){
	fs.readFile(__dirname + '/' + 'markdown.ometa.js', { encoding: 'utf8' }, onGrammar)
}

function onGrammar(err, data){
	var tree = OMetaJS.BSOMetaJSParser.matchAll(data, "topLevel", undefined, null /* error handler */)
	var res = eval(OMetaJS.BSOMetaJSTranslator.match(tree, "trans"))
	console.log('test string: ', Markdown.matchAll(testString, 'Process'))
}