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
like this.\n\n```\nvar and = plus("Here\'s some code.")```\n'

var 
	defaultFormats = {
		paragraph: defaultTag('p'),
		h1: defaultTag('h1'),
		h2: defaultTag('h2'),
		h3: defaultTag('h3'),
		emphasis: defaultTag('em'),
		literal: defaultTag('pre'),
		strong: defaultTag('strong'),
		blockquote: defaultTag('blockquote')
	},
	overrideFormats

init()

function init(){
	console.log(testString)
	var grammar = fs.readFileSync(__dirname + '/' + 'markdown.ometa.js', { encoding: 'utf8' })
	var tree = OMetaJS.BSOMetaJSParser.matchAll(grammar, "topLevel", undefined, null /* error handler */)
	Markdown = eval(OMetaJS.BSOMetaJSTranslator.match(tree, "trans"))

	console.log(util.inspect(parse(testString), { depth: 5 }))
}

function parse(str, formats){
	var result
	overrideFormats = formats
	try {
		result = Markdown.matchAll(str, 'Process')
	} catch(err){} finally {
		overrideFormats = undefined
	}
	return result
}

// used within Markdown OMeta grammar
function esc(s) {
	return s.replace(/</g,"&lt").replace(/>/g,"&gt").replace(/\n/g,"<br/>")
}

// used within Markdown OMeta grammar
function tag(type, str){
	if(overrideFormats && type in overrideFormats){
		return overrideFormats[type](str)
	} else {
		return defaultFormats[type](str)
	}
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

function setDefaultFormat(type, handler){
	if(typeof type != 'string') setMultipleDefaultFormats(types) // handle keypairs of handlers
	defaultFormats[type] = handler
}

function setMultipleDefaultFormats(types){
	for(var key in Object.keys(types)){
		setDefaultFormat(key, types[key])
	}
}

function defaultTag(type){
	return function(str){
		return '<' + type + '>' + str + '</' + type + '>'
	}
}

module.exports = {
	parse: parse,
	setDefaultFormat: setDefaultFormat
}