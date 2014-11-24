function postSignOut(event) {
  $.ajax({
    url: '/sessions',
    type: 'POST',
    dataType: 'json',
    data: $("form").serialize(),
    success: function(response) {
      if (response.valid) {
        // $('#container').hide();
        $('#div-top').html(response.html);
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

function postSignIn(event) {
  $.ajax({
    url: '/sessions',
    type: 'POST',
    dataType: 'json',
    data: $("form").serialize(),
    success: function(response) {
      if (response.valid) {
        // $('#container').hide();
        $('#div-top').html(response.html);
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