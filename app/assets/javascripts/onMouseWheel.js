function _onMouseWheel(e, delta) {
  e.preventDefault();
  // console.log(e);
}

function _x_onMouseWheel(e, delta) {
	console.log(e);
  delta = e.originalEvent.wheelDelta;
  //prevent only the actual wheel movement
  if (delta !== 0) {
    e.preventDefault();
  }

  var cur_scale;
  if (delta > 0) {
    cur_scale = scale + Math.abs(delta / 640);
  } else {
    cur_scale = scale - Math.abs(delta / 640);
  }

  //check for minimum scale limit
  if (cur_scale > min_scale) {
      
    var d=document.getElementById('graph');
    var cnvsPos=getPos(d);

    var Apos = stage.getAbsolutePosition();
    
    var mousePos = stage.getPointerPosition();

    var smallCalc  = (e.pageX - Apos.x - cnvsPos.x)/scale;
    var smallCalcY = (e.pageY - Apos.y - cnvsPos.y)/scale;

    var endCalc = (e.pageX - cnvsPos.x) - cur_scale*smallCalc;
    var endCalcY = (e.pageY - cnvsPos.y) - cur_scale*smallCalcY;

    scale = cur_scale;

    stage.setPosition( endCalc, endCalcY);

    layer.setScale(cur_scale);
    layer.draw();
  }
}

function getPos(el){
  for (var lx=0, ly=0;
   el != null;
   lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
  return {x: lx,y: ly};
}