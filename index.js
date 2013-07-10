var 
	OMetaJS = require('ometa-js'),
	OMeta = OMetaJS.core,
	Markdown,
	fs = require('fs'),
	util = require('util'),
	path = require('path')

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
	var grammar = fs.readFileSync(__dirname + path.sep + 'markdown.ometa.js', { encoding: 'utf8' })
	var tree = OMetaJS.BSOMetaJSParser.matchAll(grammar, "topLevel", undefined, null /* error handler */)
	Markdown = eval(OMetaJS.BSOMetaJSTranslator.match(tree, "trans"))
}

/*
	Parse a given string as Markdown and generate another string based on a walk of the 
	parse tree.  `formats` is an object with keys that refer to functions that take a string 
	and return the desired formatting for a given Markdown structure type.  

	E.g.:
	```
	formats = {
		h1: function(str){ return 'this is an h1: ' + str },
		paragraph: function(str){ return '<p>' + str + '</p>' }
	}
	```

	There are defaults for each Markdown type that generate generic HTML tags.
*/
function parse(str, formats){
	var result
	overrideFormats = formats
	try {
		result = Markdown.matchAll(str, 'Process')
	} catch(err){} finally {
		overrideFormats = undefined
	}
	return result.join('')
}

/*
	Sets global defaults for the parsing formats used in `parse`.
	If the first parameter is not a string, it's assumed to be an object with keys that
	each hold a formatting function.
*/
function setDefaultFormat(type, handler){
	if(typeof type != 'string') setMultipleDefaultFormats(types) // handle keypairs of handlers
	defaultFormats[type] = handler
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