$(document).ready(function() {
  stage = createStage();
  layer = createLayer(stage);
  var menu = createMenu();
});

function editLayout(event) {
  event.preventDefault();
  $.ajax({
    url: '/get_layout',
    type: 'GET',
    dataType: 'json',
    // data: $("form#form-sign-in").serialize(),
    success: function(response) {
      if (response.valid) {
        $('#div-top').html('');
        setMenuEditMode(response.htmlMenu);
        loadEditLayout(response.layout);
      }
      else {
        $('#error-signin').text('Incorrect email or password!');
      }
    },
    error: function(response) { console.log("edit error!"); console.log(response); }
  });
}

function viewLayout(event) {
  if (event) { event.preventDefault(); }
  $.ajax({
    url: '/get_layout',
    type: 'GET',
    dataType: 'json',
    // data: $("form#form-sign-in").serialize(),
    success: function(response) {
      if (response.valid) {
        $('#div-top').html('');
        setMenuViewMode(response.htmlMenu);
        loadViewLayout(response.layout);
        $('#canvasWrapper').attr("style", response.css);
        $('#canvasWrapper').css("position", "absolute");
      }
      else {
        $('#error-signin').text('Incorrect email or password!');
      }
    },
    error: function(response) { console.log("view error!"); console.log(response); }
  });
}

function saveLayout(event) {
  data = {
    layout: {objects: [],
             layer: {
               scale: layer.attrs.scaleX,
               x: layer.attrs.x,
               y: layer.attrs.y,
               offsetX: layer.getOffsetX(),
               offsetY: layer.getOffsetY(),
             }
            }
  };
  layer.getChildren().each(function(node) {
    if (node.nodeType == "Group") {
      data.layout.objects.push({
        id: node.attrs.id,
        title: node.find('.text')[0].text(),
        src: node.attrs.src,
        srcWidth: node.find(".image")[0].width(),
        srcHeight: node.find(".image")[0].height(),
        top: node.attrs.y,
        left: node.attrs.x,
        angle: node.attrs.rotation,
        scaleX: node.attrs.scaleX,
        scaleY: node.attrs.scaleY,
        offsetX: node.getOffsetX(),
        offsetY: node.getOffsetY(),
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
      if (event) {viewLayout(event);}
    },
    error: function(response) { console.log("error!"); console.log(response);}
  });
}

function cancelLayout(event) {
  viewLayout(event);
}

function editBackground(event) {
  $.ajax({
    url: '/categories_edit_background',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.valid) { showPopup(response.html); }
      else { console.log("Could not find category!"); }
    },
    error: function(response) { console.log("edit background error!"); console.log(response); }
  });
}

function updateBackground(event) {
  console.log($("form#form-update-background").serialize());
  $.ajax({
    url: '/categories_update_background',
    type: 'PUT',
    dataType: 'json',
    data: $("form#form-update-background").serialize(),
    success: function(response) {
      if (response.valid) {
        $('#canvasWrapper').attr("style", response.css);
        $('#canvasWrapper').css("position", "absolute");
      }
      else { console.log("Could not find category!"); }
    },
    error: function(response) { console.log("update category error!"); console.log(response); }
  });
}