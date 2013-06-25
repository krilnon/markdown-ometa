function esc(s) {
	return s.replace(/</g,"&lt").replace(/>/g,"&gt").replace(/\n/g,"<br/>");
}
function tag(tag, str) {
	return " <"+tag+">"+str+"</"+tag+">";
}

ometa Markdown {
	toEOL = (~seq('\n') anything)*:t '\n' -> t.join(""),
	
	//headers
	h1 = "#"   ' ' toEOL:t -> tag("h1",t),
	h2 = "##"  ' ' toEOL:t -> tag("h2",t),
	h3 = "###" ' ' toEOL:t -> tag("h3",t),

	
	//paragraph
  paraend = '\n' ' '* '\n',
	para =
		(	latexdisplay
    | latex
    | expr
		|	strong
		|	em
		|	(~paraend anything)
		)+:t
		-> tag("p",t.join("")),
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
	expr =
		"{"
		exp:t
		"}"
		-> tag("b", t),
  latex = "$" (~seq('$') char)*:t "$"       
          -> (" [beginmathjax]"+t.join("")+"[endmathjax]"),
  latexdisplay = "$$" (~seq('$') char)*:t "$$" 
                 -> (" [beginmathjaxdisplay]"+t.join("")+"[endmathjaxdisplay]"),

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
	
	//inline expressions
	num = <digit+>:n -> parseInt(n),
	term = num,
	expadd = term:a "+" term:b -> (a+b),
	expmul = term:a "*" term:b -> (a*b),
	expsub = term:a "-" term:b -> (a-b),
	expdiv = term:a "/" term:b -> (a/b),
	exp = (expmul|expdiv|expadd|expsub):e -> (" <b class='expr'>" + e + "</b>") ,
	
	//pull it all together
	line = spaces (h3|h2|h1|blockquote|codeblock|para):t spaces -> t,
	Process = line*
};

Markdown._enableTokens = function() {
	this.tokensEnabled = true;
	OMeta._enableTokens.call(this, ['h1', 'h2', 'h3', 'strong', 'codeblock', 'expr', 'em','latex','latexdisplay']);
}

Markdown