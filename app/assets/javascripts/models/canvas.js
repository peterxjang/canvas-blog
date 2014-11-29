function createStage() {
  var stage = new Kinetic.Stage({
    container: 'canvasWrapper'
  });
  stage.setWidth(window.innerWidth);
  stage.setHeight(window.innerHeight);
  window.addEventListener('resize', resizeCanvas, false);
  function resizeCanvas() {
    stage.setWidth(window.innerWidth);
    stage.setHeight(window.innerHeight);
  }
  return stage;
}

function createLayer(stage) {
  var layer = new Kinetic.Layer({
    // clearBeforeDraw : false
  });
  layer.setDraggable("draggable");
  stage.add(layer);


  layer.on('mousedown touchstart', function (e) {
    var node = e.targetNode;
    // select(node);
  });

  return layer;
}

function addZoomBackground(layer) {

  var background = new Kinetic.Rect({
    x: -10000,
    y: -10000,
    width: 20000,
    height: 20000,
    fill: "#000000",
    opacity: 0
  });
  layer.add(background);
  var startScale = 1;
  var startRotate = 0;
  var zoomOrigin = {x: 0, y: 0};
  var hammertime = Hammer(layer)
  .on("transformstart", function(e) {
    startScale = layer.scaleX();
    zoomOrigin = layer.getOffset();
  }).on("transform", function(e) {
    zoom(startScale, 
         e.gesture.scale, 
         zoomOrigin, 
         {x: e.gesture.center.pageX, y: e.gesture.center.pageY});
  });

  $('#canvasWrapper').bind('mousewheel', function(e, delta) {
    e.preventDefault();
    zoom(layer.getScaleX(), 
         (e.originalEvent.deltaY > 0 ? 0.9 : 1.1), 
         layer.getOffset(), 
         {x: e.originalEvent.clientX, y: e.originalEvent.clientY});
  });
}

function zoom(oldscale, factor, zoomOrigin, center) {
  var mx = center.x - layer.getX(),
      my = center.y - layer.getY(),
      newscale = oldscale * factor;
  zoomOrigin = {
    x: mx / oldscale + zoomOrigin.x - mx / newscale, 
    y: my / oldscale + zoomOrigin.y - my / newscale,
  };
  layer.setOffset({x: zoomOrigin.x, y: zoomOrigin.y});
  layer.setScale({x: newscale, y: newscale});
  layer.draw();
}

function loadImagesEdit(layoutData) {
  loadImages(layoutData, true);
}

function loadImagesView(layoutData) {
  loadImages(layoutData, false);
}

function loadImages(layoutData, editable) {
  layer.removeChildren();

  addZoomBackground(layer);

  var loader = new PxLoader();
  for (var i=0; i<layoutData.objects.length; i++) {
    var object = layoutData.objects[i];
    var pxImage = new PxLoaderImage(object.src);
    pxImage.top = object.top;
    pxImage.left = object.left;
    pxImage.scaleX = object.scaleX;
    pxImage.scaleY = object.scaleY;
    pxImage.zIndex = object.zIndex;
    pxImage.angle = object.angle;
    pxImage.databaseID = object.id;
    pxImage.databaseSrc = object.src;
    pxImage.databaseTitle = object.title;
    loader.add(pxImage);
  }
  loader.addProgressListener(function(e) {
    createPolaroid(e, editable);
  });
  loader.addCompletionListener(function() { 
    layer.scaleX(layoutData.layer.scale);
    layer.scaleY(layoutData.layer.scale);
    layer.x(layoutData.layer.x);
    layer.y(layoutData.layer.y);
    layer.draw();
  });
  loader.start();
}

