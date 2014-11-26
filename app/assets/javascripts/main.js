$(document).ready(function() {

  stageJSON = null;

  scale = 1.0;
  min_scale = 0.1;
  stage = createStage();
  layer = stage.getLayers()[0];
  // $(document).on("click", "#button-sign-out", postSignOut);
  $(document).on("click", "#button-sign-in", postSignIn);
  $("#sign-in").on("click", loadInitialPage);
  $(document).on("click", "#button-edit-posts", loadInitialPage);
  $(document).on("click", "#button-save-posts", saveLayout);
  $(document).on("click", "#button-view-posts", viewLayout);
});


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

function loadInitialPage(event) {
  event.preventDefault();
  $.ajax({
    url: '/sessions',
    type: 'POST',
    dataType: 'json',
    data: $("form#form-sign-in").serialize(),
    success: function(response) {
      if (response.valid) {
        $('#div-top').html(response.html);
        $('#menu').html(response.htmlMenu);
        loadImages(response.canvasObjects);
      }
      else {
        $('#error-signin').text('Incorrect email or password!');
      }
    },
    error: function(response) {
      console.log("error!");
      console.log(response);
    }
  });
}

function loadImages(objects) {
  layer.removeChildren();

  addZoomBackground(layer);

  var loader = new PxLoader();
  for (var i=0; i<objects.length; i++) {
    var object = objects[i];
    var pxImage = new PxLoaderImage(object.src);
    pxImage.top = object.top;
    pxImage.left = object.left;
    pxImage.databaseID = object.id;
    pxImage.databaseSrc = object.src;
    pxImage.databaseTitle = object.title;
    loader.add(pxImage);
  }
  loader.addProgressListener(function(e) {
    var img = e.resource.img;
    var scale = window.innerHeight / 2 / img.height;
    var yoda = new Kinetic.Image({
      x: e.resource.left,
      y: e.resource.top,
      image: img,
      draggable: true,
      scaleX: scale,
      scaleY: scale,
    });
    yoda.attrs.id = e.resource.databaseID;
    yoda.attrs.src = e.resource.databaseSrc;
    yoda.attrs.title = e.resource.databaseTitle;
    // yoda.offsetX(yoda.width()/2);
    // yoda.offsetY(yoda.height()/2);

    var startScale = 1;
    var startRotate = 0;
    var hammertime = Hammer(yoda)
    .on("touch", function(e) {
      yoda.moveToTop();
      layer.draw();
    })
    .on("transformstart", function(e) {
      startScale = yoda.scaleX();
      // startRotate = yoda.rotation();
      layer.draw();
    })
    .on("transform", function(e) {
      yoda.scale({
        x : startScale * e.gesture.scale,
        y : startScale * e.gesture.scale,
      });
      // yoda.rotation(startRotate + e.gesture.rotation);
      layer.draw();
    });

    layer.add(yoda);
    layer.draw();

  });
  loader.start();
}


function saveLayout(event) {
  // console.log(stage.toJSON());
  // stageJSON = stage.toJSON();
  data = {objects: []};
  layer.getChildren().each(function(node) {
    if (node.className == "Image") {
      console.log(node);
      data.objects.push({
        id: node.attrs.id,
        title: node.attrs.title,
        src: node.attrs.image.src,
        top: node.attrs.y,
        left: node.attrs.x,
        angle: node.attrs.rotation,
        scaleX: node.attrs.scaleX,
        scaleY: node.attrs.scaleY,
      });
    }
    // console.log(node.className)
  });
  console.log(data);
  $.ajax({
    url: '/save_layout',
    type: 'POST',
    dataType: 'json',
    data: data,
    success: function(response) {
      // if (response.valid) {
      //   $('#div-top').html(response.html);
      //   $('#menu').html(response.htmlMenu);
      //   loadImages(response.canvasObjects);
      // }
      // else {
      //   $('#error-signin').text('Incorrect email or password!');
      // }
      console.log("hi");
      console.log(response);
    },
    error: function(response) {
      console.log("error!");
      console.log(response);
    }
  });
}

function viewLayout(event) {
  // if (stageJSON) {
  //   stage.destroy();
  //   stage = Kinetic.Node.create(stageJSON, 'canvasWrapper');
  // }
}