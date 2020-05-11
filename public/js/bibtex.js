/* basic bibtex syntax highlighting. applies to all <code> blocks. completely unnecessary but adds polish */

let codeblock = document.getElementsByTagName("code");
console.log(codeblock.length)
// fill in the right info for the bibtex
try {
	for (let i = 0; i < codeblock.length; i++) {
		let today = new Date()
		let bibtex = codeblock[i].innerHTML
		bibtex = bibtex.replace("[TITLE]",bibtitle)
		bibtex = bibtex.replace("[AUTHOR]",bibauthor)
		bibtex = bibtex.replace("[KEY]",bibkey)
		bibtex = bibtex.replace("[URL]",window.location.href)
		bibtex = bibtex.replace("[ACCESSED]",'Accessed on ' + today.getFullYear() + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0') + ' from ' + window.location.href)
		codeblock[i].innerHTML = bibtex
	}

	// fill out the full citation (Harvard style)
	let holder = document.getElementsByTagName("code")
		holder = holder[0].innerHTML
	holder = toHarvard(holder)
	let x = document.getElementById("harvard").innerHTML = holder;

	// highlighting for the bibtex block. completely unnecessary but breaks up the visual monotony
	for (let i = 0; i < codeblock.length; i++) {
		let bibtex = codeblock[i].innerHTML
		bibtex = bibtex.replace(/(\s)([A-Za-z]*\s*)(\=)/g,"$1<span class='bibtexkey underline'>$2</span>$3") // keys
		bibtex = bibtex.replace(/(\s*\@[^{]*\s*)({)/g,"<span class='bibtextype highlight'>$1</span>$2")
		bibtex = bibtex.replace(/\t/g,"    ") // hard tabs mess things up
		codeblock[i].innerHTML = bibtex
	}
} catch {
	console.log('non bibtex')
}


/* function for converting bibtex directly to a Harvard formatted citation string. */
function toHarvard(bibtex) {
	let today = new Date();
	/*
	this could fire automatically after every citation code block and show up in a blockquote
	immediately following, but maybe this won't need to be run more than once ever, so
	maybe that's a terribel idea.
	*/
	let type = bibtex.match(/\s*\@[A-Za-z]*\s*\{/g)
		type = type[0].replace(/\@/g,'').replace(/\{/g,'').toLowerCase()
	let entry = {}
		entry.year = 0
	let lines = bibtex.match(/\s[A-Za-z]*\s*\=\s*\{[{}0-9A-Za-z -.]*\}/g)
	for (let x = 0; x < lines.length; x++) {
		lines[x] = lines[x].replace(/\=/g,' = ').replace(/\s\s/g,' ').replace(/\s\s/g,' ').trim().split(' = ')
		lines[x][1] = lines[x][1].replace(/\{/g,'').replace(/\}/g,'')
		if (lines[x][0] != 'year') {
			entry[lines[x][0]] = lines[x][1]
		} else {
			entry.year = parseInt(lines[x][1])
		}
	}
	let eds = 0
	if (entry.author) {
		entry.author = entry.author.split(' and ')
	}
	if (entry.editor) {
		entry.editor = entry.editor.split(' and ')
	}
	if (entry.volume) {entry.volume = parseFloat(entry.volume)}
	if (entry.volume) {entry.number = parseFloat(entry.number)}
	let year = bibtex.match(/\sdate*\s*\=/g)
	if (!year) {
		year = bibtex.match(/\syear*\s*\=/g)
	}
	year = year[0].replace(/\=/g,'').trim()

	let primary,
		editors = null
	if (entry.author) {
		primary = entry.author
	} else if (entry.editor) {
		primary = entry.editor
		eds = 1
	}
	if (entry.editor != primary) {
		editors = entry.editor
		eds = 2
	}
	let output = ''
	for (let e = 0; e < primary.length; e++) {
		if (e == 0) {
			output += primary[e]
		} else {
			primary[e] = primary[e].split(', ')
			output += primary[e][1]+' '+primary[e][0]
		}
		if (e != (primary.length - 1)) {
			output += " and "
		}
	}
	if (eds == 1) {
		output += ' (eds)'
	}
	output += '. ' + entry.year + '. <em>' + entry.title + '</em>. '

	let thisdate = today.getFullYear() + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0')

	if (eds == 2) {
		output += 'In: '
		if (editors.length > 1) {
			editors = editors.join(" and ")
		}
		output +=  editors + ' (Eds). '
	}
	output +=  entry.booktitle + '. '

	output += 'Accessed on ' + thisdate + ' from <a href="/' + window.location.href + '">' + window.location.href + '</a>'

	return(output)
}
