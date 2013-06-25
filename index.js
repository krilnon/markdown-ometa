var 
	OMetaJS = require('ometa-js'),
	OMeta = OMetaJS.core,
	Markdown,
	fs = require('fs'),
	util = require('util')

var testString = '# Big Header\n\
## Sub Headen\n\
### Sub Sub Header\n\
This *is a* paragraph, _really_. You must\n\
use **double** new lines to separate\n\
the paragraphs\n\n\
like this.\n'

init()

function init(){
	var grammar = fs.readFileSync(__dirname + '/' + 'markdown.ometa.js', { encoding: 'utf8' })
	var tree = OMetaJS.BSOMetaJSParser.matchAll(grammar, "topLevel", undefined, null /* error handler */)
	Markdown = eval(OMetaJS.BSOMetaJSTranslator.match(tree, "trans"))

	console.log(util.inspect(parse(testString), { depth: 5 }))
}

function parse(str){
	return Markdown.matchAll(str, 'Process')
}

// used within Markdown OMeta grammar
function esc(s) {
	return s.replace(/</g,"&lt").replace(/>/g,"&gt").replace(/\n/g,"<br/>")
}

// used within Markdown OMeta grammar
function tag(tag, str) {
	return { type: tag, value: str }
}

// used within Markdown OMeta grammar
function objectString(input){
	var arr = []
	
	var temp = []
	for(var i = 0; i < input.length; i++){
		var elem = input[i]
		if(typeof elem == 'string'){
			temp.push(input[i])
		} else {
			if(temp.length > 0){
				arr.push(temp.join(''))
				temp = []
			}
			
			arr.push(elem)
		}
	}
	
	if(temp.length > 0) arr.push(temp.join(''))

	return arr
}



module.exports = {
	parse: parse
}