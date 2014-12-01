function showPopup(html) {
  layer.setDraggable(false);
  $("#pop-up-background").fadeIn("slow");
  $("#pop-up").html(html).fadeIn("slow");
}

function hidePopup() {
  layer.setDraggable(true);
  $("#pop-up-background").fadeOut("slow");
  $("#pop-up").fadeOut("slow");
}