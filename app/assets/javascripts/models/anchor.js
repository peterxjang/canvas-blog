function addAnchor(group, back, x, y, name) {
	// var stage = group.getStage();
	// var layer = group.getLayer();

	var anchor = new Kinetic.Circle({
	  x: x,
	  y: y,
	  stroke: "#666",
	  fill: "#ddd",
	  strokeWidth: 2,
	  radius: back.width()/20,
	  name: name,
	  draggable: true,
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

	// Update the positions of handles during drag.
	// This needs to happen so the dimension calculation can use the
	// handle positions to determine the new width/height.
	// switch (activeHandleName) {
	//   case "topLeft":
 //      topRight.setY(activeHandle.getY());
 //      bottomLeft.setX(activeHandle.getX());
 //      break;
	//   case "topRight":
 //      topLeft.setY(activeHandle.getY());
 //      bottomRight.setX(activeHandle.getX());
 //      break;
	//   case "bottomRight":
 //      bottomLeft.setY(activeHandle.getY());
 //      topRight.setX(activeHandle.getX());
 //      break;
	//   case "bottomLeft":
 //      bottomRight.setY(activeHandle.getY());
 //      topLeft.setX(activeHandle.getX());
 //      break;
	// }

	// Calculate new dimensions. Height is simply the dy of the handles.
	// Width is increased/decreased by a factor of how much the height changed.
	// newHeight = bottomLeft.getY() - topLeft.getY();
	newHeight = activeHandle.getY();
	// console.log({newHeight: newHeight, topLeft: topLeft.getY(), calcTop: activeHandle.getY()});
	// newHeight = bottomLeft.getY() - topLeft.getY();
	newWidth = image.getWidth() * newHeight / image.getHeight();

	// Move the image to adjust for the new dimensions.
	// The position calculation changes depending on where it is anchored.
	// ie. When dragging on the right, it is anchored to the top left,
	//     when dragging on the left, it is anchored to the top right.
	// if (activeHandleName === "topRight" || activeHandleName === "bottomRight") {
	//   image.setPosition({x: topLeft.getX(), y: topLeft.getY()});
	// } else if (activeHandleName === "topLeft" || activeHandleName === "bottomLeft") {
	//   image.setPosition({x: topRight.getX() - newWidth, y: topRight.getY()});
	// }

	imageX = image.getX();
	imageY = image.getY();

	// Update handle positions to reflect new image dimensions
	// topLeft.setPosition({x: imageX, y: imageY});
	// topRight.setPosition({x: imageX + newWidth, y: imageY});
	bottomRight.setPosition({x: imageX + newWidth, y: imageY + newHeight});
	// bottomLeft.setPosition({x: imageX, y: imageY + newHeight});

	// console.log(newHeight);
	// console.log(image.getHeight() * image.parent.scaleY());
	// console.log({newHeight: newHeight, imageScale: image.parent.scaleX(), parent: image.parent});
	// Set the image's size to the newly calculated dimensions
	if (newWidth && newHeight) {
	  // image.setSize(newWidth, newHeight);
	  // image.parent.setSize(newWidth, newHeight);
	  resizePolaroid(group, newWidth, newHeight);
	}

	// make sure the image is still within the safe zone
	// var x = image.getAbsolutePosition().x;
	// var y = image.getAbsolutePosition().y;


}

function removeAnchor(group) {
	group.get(".bottomRight")[0].remove();
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