function addAnchor(group, back, x, y, name) {
	var visualAnchor = new Kinetic.Circle({
	  x: x,
	  y: y,
	  stroke: "#666",
	  fill: "#ddd",
	  strokeWidth: 2,
	  radius: back.width()/20,
	  name: 'visualAnchor'
	});
	group.add(visualAnchor);

	var anchor = new Kinetic.Circle({
	  x: x,
	  y: y,
	  stroke: "#666",
	  fill: "#ddd",
	  strokeWidth: 2,
	  radius: back.width()/20,
	  name: name,
	  draggable: true,
	  opacity: 0,
	});

	anchor.on("dragmove", function () {
	  updateAnchor(group, this);
	  layer.draw();
	});
	anchor.on("mousedown touchstart", function () {
	  group.setDraggable(false);
	  this.moveToTop();
	});
	anchor.on("dragend", function () {
	  group.setDraggable(true);
	  layer.draw();
	});
	// add hover styling
	anchor.on("mouseover", function () {
	  var layer = this.getLayer();
	  document.body.style.cursor = "pointer";
	  this.setStrokeWidth(4);
	  layer.draw();
	});
	anchor.on("mouseout", function () {
	  var layer = this.getLayer();
	  document.body.style.cursor = "default";
	  this.setStrokeWidth(2);
	  layer.draw();
	});

	group.add(anchor);
}

function updateAnchor(group, activeHandle) {
	var topLeft = group.get(".topLeft")[0],
	  topRight = group.get(".topRight")[0],
	  bottomRight = group.get(".bottomRight")[0],
	  bottomLeft = group.get(".bottomLeft")[0],
	  image = group.get(".back")[0],
	  activeHandleName = activeHandle.getName(),
	  newWidth,
	  newHeight,
	  imageX,
	  imageY;
  
  // console.log(group.getOffset());
  // group.setOffset({x: 0, y: 0});

	var diag1, diag2;
	diag1 = distance(0, 0, activeHandle.getX(), activeHandle.getY());
	diag2 = distance(0, 0, image.width(), image.height());

  var angle1, angle2;
  angle1 = degrees(Math.atan2(image.height(), image.width()));
  angle2 = degrees(Math.atan2(activeHandle.getY(), activeHandle.getX()));
  resizePolaroid(group, diag1 / diag2);
  rotatePolaroid(group, angle2 - angle1 + group.rotation());

  if (group.rotation() == 0) {
		newWidth = image.width() * diag1 / diag2;
		newHeight = image.height() * diag1 / diag2;
		imageX = image.getX();
		imageY = image.getY();
  	bottomRight.setPosition({
  		x: imageX + newWidth, 
  		y: imageY + newHeight
  	});
  }

}

function removeAnchor(group) {
	group.get(".bottomRight")[0].remove();
	group.get(".visualAnchor")[0].remove();
}


function select(node) {
	deselect();
	if (node.parent.nodeType = 'Kinetic.Group') {
	  var children = node.parent.children;
	  for (i = 1; i < children.length; i++) {
      if (children[i].getName() == 'topLeft' ||
        children[i].getName() == 'topRight' ||
        children[i].getName() == 'bottomRight' ||
        children[i].getName() == 'bottomLeft') {
        children[i].show();
      }
	  }
	}
}

function deselect() {
	var children = layer.children;
	for (i = 1; i < children.length; i++) {
	  var grandChildren = children[i].children;
	  if (grandChildren) {
      for (j = 1; j < grandChildren.length; j++) {
        if (grandChildren[j].getName() == 'topLeft' ||
          grandChildren[j].getName() == 'topRight' ||
          grandChildren[j].getName() == 'bottomRight' ||
          grandChildren[j].getName() == 'bottomLeft') {
          grandChildren[j].hide();
          layer.draw();
        }
      }
	  }
	}
}