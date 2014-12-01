function createPolaroid(e, editable) {
  var img = e.resource.img;
  var scaleX = e.resource.scaleX;
  var scaleY = e.resource.scaleY;
  currentGroup  = null;
  if (!scaleX) { scaleX = window.innerHeight / 2 / img.height / layer.scaleX(); }
  if (!scaleY) { scaleY = window.innerHeight / 2 / img.height / layer.scaleY(); }
  var group = new Kinetic.Group({
    draggable: editable,
    x: e.resource.left,
    y: e.resource.top,
    rotation: e.resource.angle,
    scaleX: scaleX,
    scaleY: scaleY,
    offsetX: e.resource.offsetX,
    offsetY: e.resource.offsetY,
    opacity: 0
  });
  var border = img.height / 20;
  var yoda = new Kinetic.Image({
    x: border,
    y: border,
    image: img,
  });
  var back = new Kinetic.Rect({
    name: 'back',
  	width: img.width + 2*border,
  	height: img.height + 6*border,
  	fill: 'white',
  	stroke: '#ccc',
  	strokeWidth: border / 10,
  })
  var text = new Kinetic.Text({
    name: 'text',
    x: border,
    y: img.height + 2*border,
    text: e.resource.databaseTitle,
    align: 'center',
    fontFamily: 'Permanent Marker',
    fill: 'black'
  });
  group.add(back);
  group.add(yoda);
  group.add(text);
  fitText(text, back, border );
  group.attrs.id = parseInt(e.resource.databaseID);
  group.attrs.src = e.resource.databaseSrc;
  group.attrs.title = e.resource.databaseTitle;

  if (editable) {
    var front = new Kinetic.Rect({
      name: 'front',
      x: 0,
      y: 0,
      width: back.width(),
      height: back.height(),
      fill: 'gray',
      stroke: 'gray',
      strokeWidth: border / 10,
      opacity: 0.8
    });
    group.add(front);


    // addAnchor(group, 0, 0, "topLeft");
    // addAnchor(group, front.width(), 0, "topRight");
    // addAnchor(group, front.width(), front.height(), "bottomRight");
    // addAnchor(group, 0, front.height(), "bottomLeft");

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
                 {x: e.gesture.center.pageX, y: e.gesture.center.pageY});
      var rotation = startRotate + e.gesture.rotation;
      group.rotation(Math.abs(rotation) < 5 ? 0 : rotation);
    });
  }
  else {
    var hammertime = Hammer(group)
    .on("touch", function(e) {
      e.preventDefault();
      showPost(group.attrs.id);
    });
  }

  layer.add(group);
  group.setZIndex(e.resource.zIndex);
  var tween = new Kinetic.Tween({
  	node: group,
  	opacity: 1
  });
  tween.play();

  layer.draw();

  return group;
}

function selectGroup(group) {
  if (currentGroup != group) {
    group.moveToTop();
    group.get('.front').opacity(0);
    dimCurrentGroup();
    currentGroup = group;
    setMenuEditItemMode();
  }
}

function dimCurrentGroup() {
  if (currentGroup) {
    currentGroup.get('.front').each(function(child) {child.opacity(0.8);});
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

function resizePolaroid(group, newWidth, newHeight) {
  var image = group.get(".back")[0];
  image.setSize({width: newWidth, height: newHeight});
  image.parent.setSize({width: newWidth, height: newHeight});
  // image.parent.scale({
  //  x: image.parent.scaleY() * newHeight / (image.getHeight()),
  //  y: image.parent.scaleY() * newHeight / (image.getHeight()),
  // });
}

function moveObjectUp(event) {
  currentGroup.moveUp();
  layer.draw();
}

function moveObjectDown(event) {
  currentGroup.moveDown();
  layer.draw();
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
  var formData = new FormData($("form#form-create-post")[0]);
  $.ajax({
    url: '/posts',
    type: 'POST',
    dataType: 'json',
    contentType: false,
    processData: false,
    // data: $("form#form-create-post").serialize(),
    data: formData,
    success: function(response) {
      if (response.valid) { 
        var firstItem = layer.find('.background')[0];
        console.log(firstItem.getPosition());
        // var firstItem = layer.find('Image')[0];
        // console.log({x: firstItem.getX(), y: firstItem.getY()});
        // console.log({xlayer: -layer.getX(), ylayer: -layer.getY()});
        var loader = new PxLoader();
        var pxImage = new PxLoaderImage(response.src);
        // pxImage.top = -layer.offsetY() * layer.scaleY(); // -  layer.getPosition().y; //0; //layer.getY() + layer.offsetY();
        // pxImage.left = -layer.offsetX() * layer.scaleX(); // - layer.getPosition().x; //layer.getX() + layer.offsetX();
        pxImage.top = 0;
        pxImage.left = 0;
        pxImage.scaleX = null;
        pxImage.scaleY = null;
        pxImage.offsetX = 0;
        pxImage.offsetY = 0;
        pxImage.zIndex = 1;
        pxImage.angle = 0;
        pxImage.databaseID = response.id;
        pxImage.databaseSrc = response.src;
        pxImage.databaseTitle = response.title;
        loader.add(pxImage);
        loader.addProgressListener(function(e) {
          var newGroup = createPolaroid(e, true);
          selectGroup(newGroup);
          saveLayout();
        });
        loader.start();
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
          // alert('Post deleted.');
        }
        else {
          console.log("Could not find post!");
        }
      },
      error: function(response) { console.log("delete post error!"); console.log(response); }
    });
  }
}