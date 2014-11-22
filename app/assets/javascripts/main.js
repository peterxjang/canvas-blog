$(document).ready(function() {
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them

  // create a wrapper around native canvas element (with id="canvas")
  var canvas = new fabric.Canvas('canvas', {HOVER_CURSOR: 'pointer'});
  canvas.renderOnAddRemove = false;
  canvas.setWidth(window.innerWidth);
  canvas.setHeight(window.innerHeight);
  zoomScale = 1;
  // makeCanvasZoomable(canvas);
  // canvas.on('selection:cleared', function() {$("#post-info").hide();})
  window.addEventListener('resize', resizeCanvas, false);
  function resizeCanvas() {
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight);
    canvas.renderAll();
  }

  $("#sign-in").on("click", function(event) {
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
          console.log(response);
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
  });

  // $("#edit-polaroids").on("click", function(event){
  //   event.preventDefault();
  //   $.ajax({
  //     url: '/posts_polaroid',
  //     type: "GET",
  //     dataType: 'json',
  //     success: function(response) {
  //       $('#container').hide();
  //       $('#div-top').append("<button id='save-layout'>Save layout</button>");
  //       loadPostImagesEdit(canvas, response.canvasData, response.canvasZoom, response.objectsData);
  //     },
  //     error: function(response) {
  //       console.log(response);
  //     }
  //   });
  // });

  // $('body').on('click', '#save-layout', function(e){
  //   var locationData = {}
  //   var objects = canvas.getObjects();
  //   for (var i=0; i<objects.length; i++) {
  //     object = objects[i];
  //     locationData[object.post_id] = {angle: object.angle,
  //                                     top: object.top,
  //                                     left: object.left,
  //                                     scaleX: object.scaleX,
  //                                     scaleY: object.scaleY}
  //     // console.log(object.post_id+" save:"+object.scaleX+", "+object.scaleY);
  //   }
  //   params = {objectsData: locationData,
  //             canvasData: canvas.viewportTransform,
  //             canvasZoom: canvas.getZoom()}
  //   console.log(canvas.viewportTransform);
  //   $.ajax({
  //     url: '/posts_polaroid_state',
  //     type: "POST",
  //     dataType: 'json',
  //     // data: {state: canvas.toJSON()},
  //     data: params,
  //     success: function(response) {
  //       console.log(canvas.toJSON());
  //       window.location.href = '/posts';
  //       $('#posts-container').show();
  //     }
  //   })

  // });


  // $("#view-polaroids").on("click", function(event){
  //   event.preventDefault();
  //   $.ajax({
  //     url: '/posts_polaroid',
  //     type: "GET",
  //     dataType: 'json',
  //     success: function(response) {
  //       $('#container').hide();
  //       loadPostImagesView(canvas, response.canvasData, response.canvasZoom, response.objectsData);
  //       // canvas.loadFromJSON(response.state);
  //       canvas.renderAll();
  //     }
  //   });
  // });

  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
});