function render_waveform(container_id, samples) {
	// create waveform object
	var test = new Waveform({container: document.getElementById(container_id)});

	//create a gradient
	var ctx = test.context;
	var gradient = ctx.createLinearGradient(0, 0, 0, test.height);
	gradient.addColorStop(0.0, "#f60");
	gradient.addColorStop(1.0, "#ff1b00");
	test.innerColor = gradient;

	// draw the waveform
	test.update({data: samples});
}
