function showPopup(html) {
  $("#pop-up-background").fadeIn("slow");
  $("#pop-up").html(html).fadeIn("slow");
}

function hidePopup() {
	console.log('hi');
  $("#pop-up-background").fadeOut("slow");
  $("#pop-up").fadeOut("slow");
}