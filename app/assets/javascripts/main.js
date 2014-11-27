$(document).ready(function() {

  stageJSON = null;

  scale = 1.0;
  min_scale = 0.1;
  stage = createStage();
  layer = stage.getLayers()[0];
  // $(document).on("click", "#button-sign-out", postSignOut);
  // $(document).on("click", "#button-sign-in", postSignIn);
  $("#sign-in").on("click", loadInitialPage);
  $(document).on("click", "#button-edit-posts", loadInitialPage);
  $(document).on("click", "#button-save-posts", saveLayout);
  $(document).on("click", "#button-view-posts", viewLayout);
});


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
        loadImages(
          response.objects, 
          response.scale,
          response.x,
          response.y
        );
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
