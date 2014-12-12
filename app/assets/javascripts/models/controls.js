function createControls(polaroid, size) {
	var controls = new Kinetic.Group({
		name: 'controls',
    x: polaroid.width() - size * 5, 
    y: polaroid.height() - size,
	});
	controls.on("mouseover", function(){
		 document.body.style.cursor = "pointer";
	});
	controls.on("mouseout", function() {
		document.body.style.cursor = "default";
	});

	var buttonUp = new Kinetic.Image({
		x: 0,
		y: 0,
		image: imageUp,
		width: size,
		height: size,
		opacity: 0.5
	});
	buttonUp.on('click tap', moveObjectUp);

	var buttonDown = new Kinetic.Image({
		x: size,
		y: 0,
		image: imageDown,
		width: size,
		height: size,
		opacity: 0.5
	});
	buttonDown.on('click tap', moveObjectDown);

	var buttonEdit = new Kinetic.Image({
		x: size * 2,
		y: 0,
		image: imageCompose,
		width: size,
		height: size,
		opacity: 0.5
	});
	buttonEdit.on('click tap', function(e) {
    editPost(currentGroup.attrs.id);
  });

	var buttonTrash = new Kinetic.Image({
		x: size * 3,
		y: 0,
		image: imageTrash,
		width: size,
		height: size,
		opacity: 0.5
	});
	buttonTrash.on('click tap', function(e) {
    deletePost(currentGroup.attrs.id);
  });
	
	controls.add(buttonUp);
	controls.add(buttonDown);
	controls.add(buttonEdit);
	controls.add(buttonTrash);
	polaroid.add(controls);
}