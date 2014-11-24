$(document).ready(function() {

  var stage = createStage();
  // $("#sign-in").on("click", loadInitialPage);

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
  return stage;
}

function loadInitialPage(event) {
  event.preventDefault();
  console.log(document.cookie);
  $.ajax({
    url: '/sessions',
    type: 'POST',
    dataType: 'json',
    data: $("form").serialize(),
    success: function(response) {
      if (response.valid) {
        // $('#container').hide();
        $('#div-top').html(response.html);
        loadPostImagesEdit(canvas, null, response.canvasZoom, response.canvasObjects);
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
  }