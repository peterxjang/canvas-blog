$(document).ready(function() {
  stage = createStage();
  layer = createLayer(stage);
  menu = createMenu();

  $(document).on("click", "#sign-in", viewLayout);
  $(document).on("click", "#pop-up-background", function(){
    $("#pop-up-background").fadeOut("slow");
    $("#pop-up").fadeOut("slow");
  });
});


function editLayout(event) {
  event.preventDefault();
  $.ajax({
    url: '/sessions',
    type: 'POST',
    dataType: 'json',
    data: $("form#form-sign-in").serialize(),
    success: function(response) {
      if (response.valid) {
        $('#div-top').html(response.html);
        setMenuEditMode(response.htmlMenu);
        loadImagesEdit(
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
    error: function(response) { console.log("edit error!"); console.log(response); }
  });
}

function viewLayout(event) {
  event.preventDefault();
  $.ajax({
    url: '/sessions',
    type: 'POST',
    dataType: 'json',
    data: $("form#form-sign-in").serialize(),
    success: function(response) {
      if (response.valid) {
        $('#div-top').html(response.html);
        setMenuViewMode(response.htmlMenu);
        loadImagesView(
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
    error: function(response) { console.log("view error!"); console.log(response); }
  });
}

function saveLayout(event) {
  data = {objects: [],
          scale: layer.attrs.scaleX,
          x: layer.attrs.x,
          y: layer.attrs.y};
  layer.getChildren().each(function(node) {
    if (node.nodeType == "Group") {
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
    }
  });
  $.ajax({
    url: '/save_layout',
    type: 'POST',
    // dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(response) {
      viewLayout(event);
    },
    error: function(response) { console.log("error!"); console.log(response);}
  });
}

function cancelLayout(event) {
  viewLayout(event);
}