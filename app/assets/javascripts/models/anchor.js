function addAnchor(group, back, x, y, name) {
	// var stage = group.getStage();
	// var layer = group.getLayer();

	var anchorVisual = new Kinetic.Circle({
	  x: x,
	  y: y,
	  stroke: "#666",
	  fill: "#ddd",
	  strokeWidth: 2,
	  radius: back.width()/20,
	  name: 'anchorVisual'
	});
	group.add(anchorVisual);

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
	// anchor.hide();
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
  	group.setOffset({x: 0, y: 0});

	// Calculate new dimensions. Height is simply the dy of the handles.
	// Width is increased/decreased by a factor of how much the height changed.
	// newHeight = activeHandle.getY();
	// newWidth = image.getWidth() * newHeight / image.getHeight();
	// newWidth = activeHandle.getX();
	// console.log({newWidth: newWidth, newHeight: newHeight});
	var diag1, diag2;
	diag1 = distance(0, 0, activeHandle.getX(), activeHandle.getY());
	diag2 = distance(0, 0, image.width(), image.height());
	// newWidth = image.width() * diag1 / diag2;
	// newHeight = image.height() * diag1 / diag2;

	// Move the image to adjust for the new dimensions.
	// The position calculation changes depending on where it is anchored.
	// ie. When dragging on the right, it is anchored to the top left,
	//     when dragging on the left, it is anchored to the top right.
	// if (activeHandleName === "topRight" || activeHandleName === "bottomRight") {
	//   image.setPosition({x: topLeft.getX(), y: topLeft.getY()});
	// } else if (activeHandleName === "topLeft" || activeHandleName === "bottomLeft") {
	//   image.setPosition({x: topRight.getX() - newWidth, y: topRight.getY()});
	// }

	// imageX = image.getX();
	// imageY = image.getY();

	// Update handle positions to reflect new image dimensions
	// topLeft.setPosition({x: imageX, y: imageY});
	// topRight.setPosition({x: imageX + newWidth, y: imageY});
	// bottomRight.setPosition({x: imageX + newWidth, y: imageY + newHeight});
	// bottomLeft.setPosition({x: imageX, y: imageY + newHeight});

	// Set the image's size to the newly calculated dimensions
	// if (newWidth && newHeight) {
	if (true) {
	  resizePolaroid(group, diag1 / diag2);

	  // console.log({oldAngle: Math.atan2(activeHandle.getY(), activeHandle.getX()), newAngle: Math.atan2(newHeight,newWidth)});
	  var angle1, angle2;
	  angle1 = degrees(Math.atan2(image.height(), image.width()));
	  angle2 = degrees(Math.atan2(activeHandle.getY(), activeHandle.getX()));
	  console.log(group.rotation());
	  console.log(angle2 - angle1 + group.rotation());
	  var rotation = angle2 - angle1 + group.rotation();
	  // group.rotation(rotation);
	  rotatePolaroid(group, rotation);
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
	  // group.rotation((angle2 - angle1) * 180 / Math.PI );
	}

	// make sure the image is still within the safe zone
	// var x = image.getAbsolutePosition().x;
	// var y = image.getAbsolutePosition().y;


}

function removeAnchor(group) {
	group.get(".bottomRight")[0].remove();
	group.get(".anchorVisual")[0].remove();
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