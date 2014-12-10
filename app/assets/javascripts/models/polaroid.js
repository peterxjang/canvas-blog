function createPolaroidNoImage(object, editable) {
  currentGroup  = null;
  var border = object.srcHeight / 20;
  var scaleX = object.scaleX;
  var scaleY = object.scaleY;
  if (!scaleX) { scaleX = window.innerHeight / 2 / object.srcHeight / layer.scaleX(); }
  if (!scaleY) { scaleY = window.innerHeight / 2 / object.srcHeight / layer.scaleY(); }
  var group = new Kinetic.Group({
    name: object.id,
    draggable: editable,
    x: object.left,
    y: object.top,
    width: object.srcWidth + 2*border,
    height: object.srcHeight + 6*border,
    rotation: object.angle,
    scaleX: scaleX,
    scaleY: scaleY,
    offsetX: object.offsetX,
    offsetY: object.offsetY,
    opacity: 1,
  });
  var back = new Kinetic.Rect({
    name: 'back',
    width: object.srcWidth + 2*border,
    height: object.srcHeight + 6*border,
    fill: 'white',
    stroke: '#ccc',
    strokeWidth: border / 10,
  })
  var text = new Kinetic.Text({
    name: 'text',
    x: border,
    y: object.srcHeight + 2*border,
    text: object.title,
    align: 'center',
    fontFamily: 'Permanent Marker',
    fill: 'black'
  });
  group.add(back);
  group.add(text);
  fitText(text, back, border );
  group.attrs.id = parseInt(object.id);
  group.attrs.src = object.src;
  group.attrs.title = object.title;

  if (editable) {
    // addAnchor(group, back, 0, 0, "topLeft");
    // addAnchor(group, back, back.width(), 0, "topRight");
    // addAnchor(group, back, back.width(), back.height(), "bottomRight");
    // addAnchor(group, back, 0, back.height(), "bottomLeft");

    var startScale = 1;
    var startRotate = 0;
    var zoomOrigin = {x: 0, y: 0};
    var hammertime = Hammer(group)
    .on("touch", function(e) {
      selectGroup(group);
    })
    .on("transformstart", function(e) {
      startScale = group.scaleX();
      startRotate = group.rotation();
      zoomOrigin = group.getOffset();
      layer.draw();
    })
    .on("transform", function(e) {
      zoomObject(group,
                 startScale, 
                 e.gesture.scale, 
                 zoomOrigin, 
                 {x: e.gesture.center.pageX, y: e.gesture.center.pageY},
                 rotation);
      var rotation = startRotate + e.gesture.rotation;
      rotatePolaroid(group, rotation);
    });
  }
  else {
    // var hammertime = Hammer(group)
    // .on("touch", function(e) {
    //   e.preventDefault();
    //   showPost(group.attrs.id);
    // });
    group.on('dblclick dbltap', function(e) {
      e.preventDefault();
      showPost(group.attrs.id);
    });
  }

  layer.add(group);
  group.setZIndex(object.zIndex);

  // var tween = new Kinetic.Tween({
  //   node: group,
  //   opacity: 1
  // });
  // tween.play();

  layer.draw();

  return group;
}

function createPolaroidImage(e) {
  var img = e.resource.img;
  var id = e.resource.data.id;
  var border = img.height / 20;
  // var group = layer.find('.'+id)[0];
  var group = e.resource.group;
  var yoda = new Kinetic.Image({
    name: 'image',
    x: border,
    y: border,
    image: img,
    opacity: 0
  });
  group.add(yoda);


  var tween = new Kinetic.Tween({
    node: yoda,
    duration: 1,
    opacity: 1
  });
  tween.play();
}

function selectGroup(group) {
  if (currentGroup != group) {
    var back = group.get(".back")[0];
    addAnchor(group, back, back.width(), back.height(), "bottomRight");
    group.moveToTop();
    group.get('.back').fill("#aff");
    dimCurrentGroup();
    currentGroup = group;
    setMenuEditItemMode();
  }
}

function dimCurrentGroup() {
  if (currentGroup) {
    removeAnchor(currentGroup);
    currentGroup.get('.back').fill("white");
  }
  layer.draw();
}

function padText(text, container, amount) {
  while (( text.width() * 1.001 ) < container.width() - ( amount * 2 ))
     text.fontSize( text.fontSize() * 1.001 );

  text.y(( container.height() - text.height() ) / 2 );

  text.width( container.width() );
  text.height( container.height() );
}

function fitText(text, container, amount) {
  var scaleWidth = (container.width() - 2*amount) / text.width();
	var scaleHeight = (3*amount) / text.height();
  var scale = Math.min(scaleWidth, scaleHeight);
	text.scaleX(scale);
	text.scaleY(scale);
  var textWidth = text.width() * scale;
  var containerWidth = (container.width() - 2*amount) * container.scaleX();
  text.offsetX((textWidth - containerWidth) / 2 / scale);
}

function resizePolaroid(group, scaleFactor) {
  // group.setSize({width: newWidth, height: newHeight});
  // var image = group.get(".back")[0];
  // image.setSize({width: newWidth, height: newHeight});
  // image.parent.setSize({width: newWidth, height: newHeight});
  // image.parent.scale({
  //  x: image.parent.scaleY() * newHeight / (image.getHeight()),
  //  y: image.parent.scaleY() * newHeight / (image.getHeight()),
  // });
  // var oldOffset = group.getOffset();
  // group.setOffset({x: 0, y: 0});
  // group.setPosition({x: 0, y: 0});
  // console.log({offset: group.offset(), pos: group.getPosition()})
  // group.setPosition({x: -oldOffset.x, y: -oldOffset.y});
  group.scale({
    // x: group.scaleX() * newHeight / image.getHeight(),
    // y: group.scaleY() * newHeight / image.getHeight()
    x: group.scaleX() * scaleFactor,
    y: group.scaleY() * scaleFactor
  })
}

function rotatePolaroid(group, rotation) {
  group.rotation(Math.abs(rotation) < 5 ? 0 : rotation);
}

function moveObjectUp(event) {
  currentGroup.moveUp();
  layer.draw();
}

function moveObjectDown(event) {
  if (currentGroup.getZIndex() > 2) {
    currentGroup.moveDown();
    layer.draw();
  }
}

function showPost(id) {
  $.ajax({
    url: '/posts/'+id,
    type: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.valid) { showPopup(response.html); }
      else { console.log("Could not find post!"); }
    },
    error: function(response) { console.log("show post error!"); console.log(response); }
  });
}

function editPost(id) {
  $.ajax({
    url: '/posts/'+id+'/edit',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.valid) { showPopup(response.html); }
      else { console.log("Could not find post!"); }
    },
    error: function(response) { console.log("edit post error!"); console.log(response); }
  });
}

function updatePost(id) {
  $.ajax({
    url: '/posts/'+id,
    type: 'PUT',
    dataType: 'json',
    data: $("form#form-update-post").serialize(),
    success: function(response) {
      if (response.valid) { 
        var text = currentGroup.get('.text')[0];
        var container = currentGroup.get('.back')[0];
        var amount = text.x();
        text.text(response.title);
        fitText(text, container, amount);
        layer.draw();
      }
      else { console.log("Could not find post!"); }
    },
    error: function(response) { console.log("update post error!"); console.log(response); }
  });
}

function newPost() {
  $.ajax({
    url: '/posts/new',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.valid) { showPopup(response.html); }
      else { console.log("Could not find post!"); }
    },
    error: function(response) { console.log("new post error!"); console.log(response); }
  });
}

function createPost() {
  $.ajax({
    url: '/posts',
    type: 'POST',
    dataType: 'json',
    contentType: false,
    processData: false,
    data: new FormData($("form#form-create-post")[0]),
    success: function(response) {
      if (response.valid) { 
        loadImages([response], true, true);
      }
      else { console.log("Could not create post!"); }
    },
    error: function(response) { console.log("create post error!"); console.log(response); }
  });
}

function deletePost(id) {
  if (confirm('Are you sure you want to delete this post?')) {
    $.ajax({
      url: '/posts/'+id,
      type: 'DELETE',
      dataType: 'json',
      success: function(response) {
        if (response.valid) {
          currentGroup.remove();
          saveLayout();
          layer.draw();
          currentGroup = null;
          setMenuEditItemMode();
        }
        else {
          console.log("Could not find post!");
        }
      },
      error: function(response) { console.log("delete post error!"); console.log(response); }
    });
  }
}