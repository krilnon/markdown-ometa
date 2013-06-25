ometa Markdown_ {
	toEOL = (~seq('\n') anything)*:t '\n' -> t.join(""),
	
	//headers
	h1 = "#"   ' ' toEOL:t -> tag("h1",t),
	h2 = "##"  ' ' toEOL:t -> tag("h2",t),
	h3 = "###" ' ' toEOL:t -> tag("h3",t),
	
	//paragraph
  paraend = '\n' ' '* '\n',
	para =
		(	strong
		|	em
		|	(~paraend anything)
		)+:t
		-> tag("p", objectString(t)),
      //	text = <(~seq('\n\n') anything)*>,
	strong =
		"**"
		<(~seq('**') anything)*>:t
		"**"
		-> tag("strong", t),
	em =
		( "*" <(~seq('*') anything)*>:t "*" 
    	| "_" <(~seq('_') anything)*>:t "_") 
		-> tag("em", t),

	//blockquote
	blockquote = "> " para:t -> tag("blockquote",t),
	
	//code block
	cbdelim =
		seq('```\n'),
	codeblock =
		cbdelim
		<(~seq('```') anything)*>:t
		cbdelim
		-> tag("pre", esc(t)),
	
	//pull it all together
	line = spaces (h3|h2|h1|blockquote|codeblock|para):t spaces -> t,
	Process = line*
};

Markdown_._enableTokens = function() {
	this.tokensEnabled = true;
	OMeta._enableTokens.call(this, ['h1', 'h2', 'h3', 'strong', 'codeblock', 'expr', 'em','latex','latexdisplay']);
}

Markdown_