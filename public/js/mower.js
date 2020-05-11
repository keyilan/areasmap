function minutes(time) {
	let minutes = Math.floor(time / 60);
	let seconds = time % 60
	seconds = parseInt(seconds*100)/100
	if (seconds < 10) {seconds = '0'+seconds}
	return minutes+":"+seconds
}

if (svgfile == false) {
	let points = '0,' + yres + ' ',
		pathing = 'M 0 ' + yres + ', C ',
		newwave = []
	for (let i = 0; i < wave.length; i++) {
		if (i % 2 == 0) {
			newwave.push(wave[i])
		}
	}
	wave = newwave
	for (let i = 0; i < wave.length; i++) {
		wave[i] = parseInt(wave[i] * 100) / 100
		if (wave[i] < .02) {wave[i] = 0}
		if (i != wave.length - 1) {
			if (i % 2 == 0) {
				points += parseInt((i * xres) * 2) + "," + (yres - parseInt(wave[i] * yres * 10) / 10 * 2) + " "
				pathing += parseInt((i * xres) * 2) + " " + (yres - parseInt(wave[i] * yres * 10) / 10 * 2) + ", "
			} else {
				points += parseInt((i * xres) * 2)+ "," + (yres + parseInt(wave[i] * yres * 10) / 10 * 2) + " "
				pathing += parseInt((i * xres) * 2)+ " " + (yres + parseInt(wave[i] * yres * 10) / 10 * 2) + ", "
			}
		} else {
			pathing += parseInt((i * xres) * 2)+ " " + (yres + parseInt(wave[i] * yres * 10) / 10 * 2)
		}
		//- pathing = pathing.replace(/,\s*$/, "");

	}

	let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width',wid);
		svg.setAttribute('height','40');
	document.getElementById("waveform").appendChild(svg);

	let poly = document.createElementNS("http://www.w3.org/2000/svg","polyline");
		poly.setAttribute("points", points);
		poly.setAttribute('fill', 'none');
		poly.setAttribute('stroke', 'rgb(252, 225, 129)');
		poly.setAttribute('stroke-width', '1');
		poly.setAttribute('stroke-linejoin', 'round');
	svg.appendChild(poly);

	console.log(svg)
}


// sizing
document.getElementById("timelinetitles").style.height = tiersheight * 4 + 'em'
document.getElementById("waveform").style.height = (yres*2)+'px'

// player functions
var aud = document.getElementById("player");
aud.addEventListener('ended', function(e) {
	aud.pause();
}, false);
aud.loadedmetadata = function() {
	duration = aud.duration
}
aud.ontimeupdate = function() {updateTimer()};
aud.onplay = function() {
	document.getElementById("totaltime").innerHTML = minutes(aud.duration)
};
duration = aud.duration



// find best value in array of annotation times
function closest(array,num){
	num = num-1
	// one removed from _num_ to keep it from jumping the gun. the closest
	// match actually gets triggered halfway between the values, so
	// it's not actually the best way to trigger scrolling
	let i = 0
	let minDiff = 1000
	let match
	for(i in array){
		 let m = Math.abs(num-array[i])
		 if (m < minDiff) {
				minDiff = m
				match = array[i]
			}
	  }
	return match
}

let lasttime = 0;

// animate only when needed
function moveMower(time) {
	if (time != lasttime) {
		lasttime = time
		let pos = parseInt(time * 100)
		scrollTo(document.getElementById("timeline"),pos * xres,250)
	}
}

// mower animation
function scrollTo(element, target, duration) {
	let startpos = element.scrollLeft
	let change = target - startpos
	let currentTime = 0
	let animate = function() {
		currentTime += 25;
		let edge = Math.easeInOutQuad(currentTime, startpos, change, duration);
		element.scrollLeft = edge;
		if (currentTime < duration) {
			setTimeout(animate, 25);
		}
	}
	animate();
}

// watch the clock
function updateTimer() {
	let thistime = (parseInt(parseFloat(aud.currentTime)*100)/100)
	moveMower(closest(times,thistime))
	let time = minutes(thistime)
	if (time == '0:00') {time = '0:00.00'}
	document.getElementById("clock").innerHTML = time;
	let w = parseInt(document.getElementById("progress").clientWidth)
	let x = parseInt((aud.currentTime / aud.duration) * 1000)/1000
	document.getElementById("progchild").style.width = parseInt(x * w)

}

// make it smooth
Math.easeInOutQuad = function (time, start, dif, dur) {
  time /= dur / 2
	if (time < 1) return dif / 2 * time * time + start
	time--
	return -dif / 2 * (time * (time - 2) - 1) + start
};

function stop() {
	let aud = document.getElementById("player")
	aud.pause()
	aud.currentTime = 0
}

function select(input) {
	document.getElementById("player").currentTime = input
}

var svgticks = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgticks.setAttribute('width',wid);
svgticks.setAttribute('height','40');
let ticks = document.getElementById("ticks")
for (let x = 1; x < parseInt(duration * 100); x++) {
	let line = document.createElementNS('http://www.w3.org/2000/svg','line');
	line.setAttribute('id','line2');
	line.setAttribute('x1', parseInt(x * 100 * xres));
	line.setAttribute('y1', '0');
	line.setAttribute('x2', parseInt(x * 100 * xres));
	line.setAttribute('y2', '5');
	line.setAttribute("stroke", 'black')
	svgticks.appendChild(line);
}

document.getElementById("ticks").appendChild(svgticks);
