$(document).ready(function() {
  scale = 1.0;
  min_scale = 0.1;
  stage = createStage();
  layer = stage.getLayers()[0];
  // $(document).on("click", "#button-sign-out", postSignOut);
  $(document).on("click", "#button-sign-in", postSignIn);
  $("#sign-in").on("click", loadInitialPage);
  // $('#graph').bind('mousewheel', onMouseWheel);
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
    // alert('HI');
    console.log('hi');
    // console.log(layer.scaleX());
    startScale = layer.scaleX();
    // startScale = background.scaleX();
    // startRotate = background.rotation();
    // layer.draw();
  }).on("transform", function(e) {
    // console.log(startScale * e.gesture.scale);
    // layer.setScale(startScale * e.gesture.scale);
    layer.scale({
      x : startScale * e.gesture.scale,
      y : startScale * e.gesture.scale,
    });
    // console.log(layer.getScale());
    // background.scale({
    //   x : startScale * e.gesture.scale,
    //   y : startScale * e.gesture.scale,
    // });
    // // background.rotation(startRotate + e.gesture.rotation);
    layer.draw();
  });
  stage.add(layer);
  return layer;
}

function loadInitialPage(event) {
  event.preventDefault();
  $.ajax({
    url: '/sessions',
    type: 'POST',
    dataType: 'json',
    data: $("form").serialize(),
    success: function(response) {
      if (response.valid) {
        // $('#container').hide();
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
  var loader = new PxLoader();
  for (var i=0; i<objects.length; i++) {
    var object = objects[i];
    loader.addImage(object.src);
  }
  loader.addProgressListener(function(e) {
    var yoda = new Kinetic.Image({
      x: object.left,
      y: object.top,
      image: e.resource.img,
      draggable: true,
    });

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

    // add the shape to the layer
    layer.add(yoda);
    layer.draw();


  });
  loader.start();
}
