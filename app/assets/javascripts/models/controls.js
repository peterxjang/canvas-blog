function createControls(polaroid, size) {
	var controls = new Kinetic.Group({
		name: 'controls',
    x: polaroid.width() - size * 5, 
    y: polaroid.height() - size,
	});

	var data = [
		{image: imageUp, handler: moveObjectUp},
		{image: imageDown, handler: moveObjectDown},
		{image: imageCompose, handler: editCurrentPost},
		{image: imageTrash, handler: deleteCurrentPost},
	];
	var opacity = 0.3;
	for (var i=0; i<data.length; i++) {
		var button = new Kinetic.Image({
			x: size * i,
			y: 0,
			image: data[i].image,
			width: size,
			height: size,
			opacity: opacity
		});
		button.on('mousedown touchstart', data[i].handler);
		controls.add(button);
		button.on("mouseover", function(){
		 	document.body.style.cursor = "pointer";
			this.opacity(1.0);
			layer.draw();
		});
		button.on("mouseout", function(){
			document.body.style.cursor = "default";
			this.opacity(opacity);
			layer.draw();
		});
	}
	polaroid.add(controls);
}