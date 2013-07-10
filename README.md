markdown-ometa
==============

A Markdown processor in OMeta.  This fork focuses on making an npm module out of the original editor demonstration.

# Example Usage
```javascript
var 
	md = require('markdown-ometa'),
	util = require('util')

var testString = '# Big Header\n\
## Sub Header\n\
### Sub Sub Header\n\
This *is a* paragraph, _really_. You must\n\
use **double** new lines to separate\n\
the paragraphs\n\n\
like this.\n\n```\nvar and = plus("Here\'s some code.")```\n'

init()

function init(){
	console.log(testString) // print the Markdown before it's processed
	console.log(util.inspect(md.parse(testString), { depth: 5 })) // print the processed Markdown
}
```

## Contributors

* Josh Marinacci (original author)
* Page @Page-
* Felix Breuer
* krilnon (this fork)

## See also

* http://joshondesign.com/p/demos/ometa/markdown/webeditor.html
* http://vpri.org/pipermail/ometa/2013-March/000509.html
* http://markdown-highlighted.herokuapp.com/webeditor.html

