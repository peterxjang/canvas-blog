function createPolaroid(e) {
    var img = e.resource.img;
    // var scale = window.innerHeight / 2 / img.height;
    var scaleX = e.resource.scaleX;
    var scaleY = e.resource.scaleY;
    if (!scaleX) { scaleX = window.innerHeight / 2 / img.height; }
    if (!scaleY) { scaleY = window.innerHeight / 2 / img.height; }
    var yoda = new Kinetic.Image({
      x: e.resource.left,
      y: e.resource.top,
      image: img,
      draggable: true,
      scaleX: scaleX,
      scaleY: scaleY,
      rotation: e.resource.angle,
      opacity: 0
    });
    yoda.attrs.id = parseInt(e.resource.databaseID);
    yoda.attrs.src = e.resource.databaseSrc;
    yoda.attrs.title = e.resource.databaseTitle;
    // yoda.offsetX(yoda.width()/2);
    // yoda.offsetY(yoda.height()/2);
    // yoda.transitionTo({opacity: 1, duration: 4});

    var startScale = 1;
    var startRotate = 0;
    var hammertime = Hammer(yoda)
    .on("touch", function(e) {
      yoda.moveToTop();
      layer.draw();
    })
    .on("transformstart", function(e) {
      startScale = yoda.scaleX();
      startRotate = yoda.rotation();
      layer.draw();
    })
    .on("transform", function(e) {
      yoda.scale({
        x : startScale * e.gesture.scale,
        y : startScale * e.gesture.scale,
      });
      yoda.rotation(startRotate + e.gesture.rotation);
      layer.draw();
    });

    layer.add(yoda);
    yoda.setZIndex(e.resource.zIndex);
    var tween = new Kinetic.Tween({
    	node: yoda,
    	opacity: 1
    });
    tween.play();
    layer.draw();
  }