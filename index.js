/* using express.js to display for now. may change in a future update */
const express = require('express')
const app = express()
const router = express.Router()

/* logging */
const rfs = require('rotating-file-stream')
var morgan = require('morgan')

/* localisation */
const i18n = require("i18n")

/* non-express stuff */
const fs = require('fs');
const path = require('path');
const util = require('util');
const { spawn } = require('child_process');
const md = require('markdown-it')({html: true});
const bibparse = require("bibtex-parser")

let port = 3003;

/* localisation */
i18n.configure({
	autoReload: true,
	defaultLocale: 'en',
	directory: __dirname + '/locales',
	locales:['en']
});
console.log(i18n.getLocale())

/* page data */
let pages = []
fs.readdir('./pages/' + i18n.getLocale() + '/', function(err, files){
	pages = [];
	files.forEach(function(file){
		if (file != '.DS_Store' && file != 'users' && file != 'cite.md' && file != 'home.md' && file != 'privacy.md') {
			// cite and home are handled differently. privacy is in the footer.
			pages.push(file.replace('.md',''));
		}
	});
})

function readFile(filename) {
	return fs.readFileSync(path.join(__dirname, filename), 'utf8')
}

function exists(filename) {
	fs.access(filename, (err) => {
		if (err) {
			console.log(err)
		} else {
			return true
		}
	})
}

function writeFile(content,name,ext) {
	fs.writeFile("./public/files/"+name+"."+ext, content, function(err) {
		if (err) {
			console.log('Error: ' + err);
		} else {
			console.log('File saved');
		}
	});
}

function fileList() {
	let files = []
	fs.readdir('./public/files/', function(err, data){
		for (let i = 0; i < data.length; i++) {
			var res = data[i].match(/([a-zA-Z0-9\s_\\.\-\(\):])+(.eaf)$/i);
			if (res) {
				files.push(res[0].replace('.eaf',''))
			}
		}
	});
	return files
}

/* project metadata & homepage sidebar contents */
let metadata = require('./metadata.json')
let news = require('./news.json')
	news.sort((a, b) => (a.date > b.date) ? 1 : -1)

/* express.js */
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
});
app.use(morgan('combined', { stream: accessLogStream }))

app.use(express.static('public'))
app.set('view engine', 'pug')
app.use('/', router)

router.get('/img/favicon.png', (req, res) => res.status(204));

router.get('/', function(req, res) {
	let pagedata = fs.readFileSync(path.join(__dirname, './pages/' + i18n.getLocale() + '/home.md'), 'utf8')
	res.render('index', {
		active: 'home',
		contents:pagedata,
		i18n: i18n,
		md: md,
		metadata: metadata,
		news:news,
		pages: pages,
		title: i18n.__('HOME')
	})
})

router.get('/p/', function(req, res){
	res.render('dir', {
		i18n: i18n,
		pages: pages,
		title: i18n.__('DIR')
	});
});

router.get('/p/:page', function(req, res){
	let pagedata = fs.readFileSync(path.join(__dirname, './pages/' + i18n.getLocale() + '/' + req.params.page + '.md'), 'utf8')
	res.render('page', {
		contents: pagedata,
		i18n: i18n,
		md: md,
		pages: pages,
		title: req.params.page[0].toUpperCase() + req.params.page.slice(1),
		active: req.params.page
	})
})

app.listen(port, () => console.log(port))
