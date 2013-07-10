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
		-> tag("paragraph", objectString(t)),
	strong =
		"**"
		<(~seq('**') anything)*>:t
		"**"
		-> tag("strong", t),
	em =
		( "*" <(~seq('*') anything)*>:t "*" 
		| "_" <(~seq('_') anything)*>:t "_") 
		-> tag("emphasis", t),

	//blockquote
	blockquote = "> " para:t -> tag("blockquote",t),
	
	//code block
	cbdelim =
		seq('```\n'),
	codeblock =
		cbdelim
		<(~seq('```') anything)*>:t
		cbdelim
		-> tag("literal", esc(t)),
	
	//pull it all together
	line = spaces (h3|h2|h1|blockquote|codeblock|para):t spaces -> t,
	Process = line*
}

Markdown_