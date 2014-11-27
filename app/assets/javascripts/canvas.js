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
  createLayer(stage);
  return stage;
}

function createLayer(stage) {
  var layer = new Kinetic.Layer({
    // clearBeforeDraw : false
  });
  layer.setDraggable("draggable");
  stage.add(layer);
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
  var hammertime = Hammer(layer)
  .on("transformstart", function(e) {
    startScale = layer.scaleX();
  }).on("transform", function(e) {
    layer.scale({
      x : startScale * e.gesture.scale,
      y : startScale * e.gesture.scale,
    });
    layer.draw();
  });

  $('#canvasWrapper').bind('mousewheel', function(e, delta) {
    e.preventDefault();
    var delta = e.originalEvent.wheelDelta;
    // var cur_scale;
    // if (delta > 0) {
    //   startScale = startScale + Math.abs(delta / 640);
    // } else {
    //   startScale = startScale - Math.abs(delta / 640);
    // }
    // console.log(startScale);
    // layer.scale({
    //   x: startScale, //* e.originalEvent.wheelDelta,
    //   y: startScale, //* e.originalEvent.wheelDelta,
    // });
  });
}


function loadImages(objects, canvasScale, canvasX, canvasY) {
  console.log(objects);
  layer.removeChildren();

  addZoomBackground(layer);

  var loader = new PxLoader();
  for (var i=0; i<objects.length; i++) {
    var object = objects[i];
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
    createPolaroid(e);
  });
  loader.addCompletionListener(function() { 
    layer.scaleX(canvasScale);
    layer.scaleY(canvasScale);
    layer.x(canvasX);
    layer.y(canvasY);
    layer.draw();
  });
  loader.start();
}


function saveLayout(event) {
  // console.log(stage.toJSON());
  // stageJSON = stage.toJSON();
  data = {objects: [],
          scale: layer.attrs.scaleX,
          x: layer.attrs.x,
          y: layer.attrs.y};
  layer.getChildren().each(function(node) {
    if (node.className == "Image") {
      data.objects.push({
        id: node.attrs.id,
        title: node.attrs.title,
        src: node.attrs.src,
        top: node.attrs.y,
        left: node.attrs.x,
        angle: node.attrs.rotation,
        scaleX: node.attrs.scaleX,
        scaleY: node.attrs.scaleY,
        zIndex: node.getZIndex(),
      });
    } else if (node.className == "Rect"){
      // console.log(node);
    }
  });
  console.log(layer);
  console.log(data);
  $.ajax({
    url: '/save_layout',
    type: 'POST',
    // dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(response) {},
    error: function(response) { console.log("error!"); console.log(response);}
  });
}

function viewLayout(event) {
  // if (stageJSON) {
  //   stage.destroy();
  //   stage = Kinetic.Node.create(stageJSON, 'canvasWrapper');
  // }
}