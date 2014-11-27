function createPolaroid(e) {
    var img = e.resource.img;
    // var scale = window.innerHeight / 2 / img.height;
    var scaleX = e.resource.scaleX;
    var scaleY = e.resource.scaleY;
    if (!scaleX) { scaleX = window.innerHeight / 2 / img.height; }
    if (!scaleY) { scaleY = window.innerHeight / 2 / img.height; }
    var group = new Kinetic.Group({
      draggable: true,
      x: e.resource.left,
      y: e.resource.top,
      rotation: e.resource.angle,
      scaleX: scaleX,
      scaleY: scaleY,
      opacity: 0
    });
    var border = img.height / 20;
    var yoda = new Kinetic.Image({
      // x: e.resource.left,
      // y: e.resource.top,
      x: border,
      y: border,
      image: img,
      // scaleX: scaleX,
      // scaleY: scaleY,
      // rotation: e.resource.angle,
      // opacity: 0
    });
    var back = new Kinetic.Rect({
    	width: img.width + 2*border,
    	height: img.height + 6*border,
    	fill: 'white',
    	stroke: '#ccc',
    	strokeWidth: border / 10,
    })
    group.add(back);
    group.add(yoda);
    group.attrs.id = parseInt(e.resource.databaseID);
    group.attrs.src = e.resource.databaseSrc;
    group.attrs.title = e.resource.databaseTitle;
    // group.offsetX(group.width()/2);
    // group.offsetY(group.height()/2);

    var startScale = 1;
    var startRotate = 0;
    var hammertime = Hammer(group)
    .on("touch", function(e) {
      group.moveToTop();
      layer.draw();
    })
    .on("transformstart", function(e) {
      startScale = group.scaleX();
      startRotate = group.rotation();
      layer.draw();
    })
    .on("transform", function(e) {
      group.scale({
        x : startScale * e.gesture.scale,
        y : startScale * e.gesture.scale,
      });
      group.rotation(startRotate + e.gesture.rotation);
      layer.draw();
    });

    layer.add(group);
    group.setZIndex(e.resource.zIndex);
    var tween = new Kinetic.Tween({
    	node: group,
    	opacity: 1
    });
    tween.play();
    layer.draw();
  }