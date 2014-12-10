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
  var layer = new Kinetic.Layer();
  layer.setDraggable("draggable");
  stage.add(layer);
  return layer;
}

function addZoomBackground(layer) {

  var background = new Kinetic.Rect({
    name: 'background',
    x: -10000,
    y: -10000,
    width: 20000,
    height: 20000,
    fill: "#000000",
    opacity: 0,
  });
  // background.setZIndex(-1);
  layer.add(background);
  var startScale = 1;
  var startRotate = 0;
  var zoomOrigin = {x: 0, y: 0};
  var hammertime = Hammer(layer)
  .on("transformstart", function(e) {
    startScale = layer.scaleX();
    zoomOrigin = layer.getOffset();
  }).on("transform", function(e) {
    zoomObject(layer,
               startScale, 
               e.gesture.scale, 
               zoomOrigin, 
               {x: e.gesture.center.pageX, y: e.gesture.center.pageY});
  });

  $('#canvasWrapper').bind('mousewheel', function(e, delta) {
    e.preventDefault();
    zoomObject(layer,
               layer.getScaleX(), 
               (e.originalEvent.deltaY > 0 ? 0.9 : 1.1), 
               layer.getOffset(), 
               {x: e.originalEvent.clientX, y: e.originalEvent.clientY});
    layer.draw();
  });

  background.on('mousedown touchstart', function (e) {
    dimCurrentGroup();
    currentGroup = null;
    setMenuEditItemMode();
  });

  background.on('dblclick dbltap', function(event) {
    zoomFit(event);
  });
}

function zoomObject(object, oldscale, factor, zoomOrigin, center) {
  var mx = center.x - object.getAbsolutePosition().x,
      my = center.y - object.getAbsolutePosition().y,
      newscale = oldscale * factor;
  zoomOrigin = {
    x: mx / oldscale + zoomOrigin.x - mx / newscale, 
    y: my / oldscale + zoomOrigin.y - my / newscale,
  };
  object.setOffset({x: zoomOrigin.x, y: zoomOrigin.y});
  object.setScale({x: newscale, y: newscale});
}

function zoomFit() {
  var boundingRect, x, y, w, h, buffer;
  var xValues = [], yValues = [];
  var xScaledValues = [], yScaledValues = [];
  layer.find('Group').each(function(group) {
    x = group.getAbsolutePosition().x;
    y = group.getAbsolutePosition().y;
    buffer = Math.max(
      group.get(".back")[0].width() * group.scaleX() * layer.scaleX(), 
      group.get(".back")[0].height() * group.scaleY() * layer.scaleY()
    );
    buffer = buffer * 0.75;
    xValues.push(x - buffer);
    xValues.push(x + buffer);
    yValues.push(y - buffer);
    yValues.push(y + buffer);

    xScaledValues.push(group.getPosition().x);
    yScaledValues.push(group.getPosition().y);
  });
  boundingRect = {
    xmin: Math.min.apply(Math, xValues),
    xmax: Math.max.apply(Math, xValues),
    ymin: Math.min.apply(Math, yValues),
    ymax: Math.max.apply(Math, yValues),
  }
  var scaleX = window.innerWidth / (boundingRect.xmax - boundingRect.xmin);
  var scaleY = window.innerHeight / (boundingRect.ymax - boundingRect.ymin);
  var scale = Math.min(scaleX, scaleY);
  // layer.offsetX(0);
  // layer.offsetY(0);
  // var tween = new Kinetic.Tween({
  //   node: layer,
  //   scaleX: layer.scaleX() * scale,
  //   scaleY: layer.scaleY() * scale,
  //   x: layer.x() - boundingRect.xmin,
  //   y: layer.y() - boundingRect.ymin,
  //   offsetX: 0, //boundingRect.xmax - boundingRect.xmin, //layer.x() - boundingRect.xmin,
  //   offsetY: 0, //boundingRect.ymax - boundingRect.ymin, //layer.y() - boundingRect.ymin,

  //       onFinish: function() {
  //         layer.setAbsolutePosition({x: boundingRect.xmin, y:boundingRect.ymin});
  //       }
  // });
  // tween.play();
  layer.offset({
    x: Math.min.apply(Math, xScaledValues), 
    y: Math.min.apply(Math, yScaledValues)
  });
  layer.scale({
    x: layer.scaleX() * scale, 
    y: layer.scaleY() * scale
  });
  layer.setAbsolutePosition({
    x: 50,
    y: 50,
  });

  layer.draw();
}

function loadEditLayout(layoutData) {
  loadLayout(layoutData, true);
}

function loadViewLayout(layoutData) {
  loadLayout(layoutData, false);
}

function loadLayout(layoutData, editable) {
  layer.removeChildren();

  addZoomBackground(layer);

  layer.scaleX(layoutData.layer.scale);
  layer.scaleY(layoutData.layer.scale);
  layer.x(layoutData.layer.x);
  layer.y(layoutData.layer.y);
  layer.offsetX(layoutData.layer.offsetX);
  layer.offsetY(layoutData.layer.offsetY);
  layer.draw();

  loadImages(layoutData.objects, editable);
}

function loadImages(objects, editable, create) {
  var loader = new PxLoader();
  for (var i=0; i<objects.length; i++) {
    var object = objects[i];
    
    var pxImage = new PxLoaderImage(object.src);
    pxImage.data = object;

    if (object.srcWidth) {
      var group = createPolaroidNoImage(object, editable);
      pxImage.group = group;
    }
    loader.add(pxImage);
  }
  loader.addProgressListener(function(e) {
    // createPolaroid(e, editable);
    if (!e.resource.data.srcWidth) {
      var data = e.resource.data;
      data.srcWidth = e.resource.img.width;
      data.srcHeight = e.resource.img.height;
      var group = createPolaroidNoImage(data, editable);
      e.resource.group = group;
    }
    createPolaroidImage(e);
    if (create) {
      selectGroup(group);
      saveLayout();
    }
  });
  // loader.addCompletionListener(function() {});
  loader.start();
}