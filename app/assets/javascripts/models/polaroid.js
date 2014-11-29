function createPolaroid(e, editable) {
  // console.log({e: e, editable: editable});
  var img = e.resource.img;
  // var scale = window.innerHeight / 2 / img.height;
  var scaleX = e.resource.scaleX;
  var scaleY = e.resource.scaleY;
  currentGroup  = null;
  if (!scaleX) { scaleX = window.innerHeight / 2 / img.height; }
  if (!scaleY) { scaleY = window.innerHeight / 2 / img.height; }
  var group = new Kinetic.Group({
    draggable: editable,
    x: e.resource.left,
    y: e.resource.top,
    rotation: e.resource.angle,
    scaleX: scaleX,
    scaleY: scaleY,
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
    x: border,
    y: img.height + 2*border,
    text: e.resource.databaseTitle,
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
  // group.offsetX(group.width()/2);
  // group.offsetY(group.height()/2);

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
    var hammertime = Hammer(group)
    .on("touch", function(e) {
      group.moveToTop();
      if (currentGroup) {
        currentGroup.get('.front').each(function(child) {child.opacity(0.8);});
      }
      front.opacity(0);
      layer.draw();
      currentGroup = group;
    })
    .on("transformstart", function(e) {
      startScale = group.scaleX();
      startRotate = group.rotation();
      layer.draw();
    })
    .on("transform", function(e) {
      group.scale({
        x : startScale * e.gesture.scale,
        y : startScale * e.gesture.scale,
      });
      group.rotation(startRotate + e.gesture.rotation);
      layer.draw();
    });
  }
  else {
    var hammertime = Hammer(group)
    .on("touch", function(e) {
      e.preventDefault();
      $.ajax({
        url: '/view_post',
        type: 'POST',
        dataType: 'json',
        data: {post_id: group.attrs.id},
        success: function(response) {
          if (response.valid) {
            $("#pop-up-background").fadeIn("slow");
            $("#pop-up").html(response.html).fadeIn("slow");
          }
          else {
            console.log("Could not find post!");
          }
        },
        error: function(response) { console.log("view post error!"); console.log(response); }
      });
    });
  }

  layer.add(group);
  group.setZIndex(e.resource.zIndex);
  console.log({zindex: group.getZIndex(), title: e.resource.databaseTitle});
  var tween = new Kinetic.Tween({
  	node: group,
  	opacity: 1
  });
  tween.play();

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
	var scale = (container.width() - 2*amount) / text.width();
	text.scaleX(scale);
	text.scaleY(scale);
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
