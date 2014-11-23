function makeCanvasZoomable(canvas) {
  $("body").on("mousewheel", function (event, delta) {
    var mousePageX = event.pageX;
    var mousePageY = event.pageY;
    var offset = $("#canvas").offset();
    var canvasX = offset.left;
    var canvasY = offset.top;
    // Ignore if mouse is not on canvas
    if (mousePageX < canvasX || mousePageY < canvasY || mousePageX > (canvasX + canvas.width)
                || mousePageY > (canvasY + canvas.height)) {
        return;
    }
    var scaleFactor = 1.1;
    var change = (delta > 0) ? scaleFactor : (1 / scaleFactor);
    var newZoomScale = zoomScale * change;
    zoomScale = newZoomScale;
    canvas.zoomToPoint({ x: event.offsetX, y: event.offsetY }, zoomScale);
    event.stopPropagation();
    event.preventDefault();
  });

  var viewportLeft = 0,
      viewportTop = 0,
      mouseLeft,
      mouseTop,
      _drawSelection = canvas._drawSelection,
      isDown = false;

  // $('body').mousedown(function(e) {
  canvas.on('mouse:down', function(options) {
    isDown = true;
    viewportLeft = canvas.viewportTransform[4];
    viewportTop = canvas.viewportTransform[5];
    // mouseLeft = e.pageX;
    // mouseTop = e.pageY;
    mouseLeft = options.e.x;
    mouseTop = options.e.y;
    if (!canvas.getActiveObject()) {
      _drawSelection = canvas._drawSelection;
      canvas._drawSelection = function(){ };
    }
  });

  // $('body').mousemove(function(e) {
  canvas.on('mouse:move', function(options) {
    if (!canvas.getActiveObject() && isDown) {
      // var currentMouseLeft = e.pageX;
      // var currentMouseTop = e.pageY;
      var currentMouseLeft = options.e.x;
      var currentMouseTop = options.e.y;
      var deltaLeft = currentMouseLeft - mouseLeft,
          deltaTop = currentMouseTop - mouseTop;
      canvas.viewportTransform[4] = viewportLeft + deltaLeft;
      canvas.viewportTransform[5] = viewportTop + deltaTop;
      canvas.renderAll();
    }
  });

  // $('body').mouseup(function(e) {
  canvas.on('mouse:up', function(options) {
    canvas._drawSelection = _drawSelection;
    isDown = false;
    // canvas.zoomToPoint({ x: e.offsetX, y: e.offsetY }, zoomScale);
    canvas.zoomToPoint({ x: options.e.x, y: options.e.y }, zoomScale);
    // $('#post-info').hide();
  });
}
