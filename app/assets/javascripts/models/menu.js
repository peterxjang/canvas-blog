function createMenu() {
  $(document).on("click", "#button-edit-posts", editLayout);
  $(document).on("click", "#button-save-posts", saveLayout);
  $(document).on("click", "#button-cancel-posts", cancelLayout);
  $(document).on("click", "#button-view-posts", viewLayout);
  $(document).on("click", "#button-moveup", moveObjectUp);
  $(document).on("click", "#button-movedown", moveObjectDown);
}

function setMenuEditMode(html) {
  $('#menu').html(html);
  $('#button-edit-posts').hide();
  $('#button-view-posts').hide();
  $('#button-save-posts').show();
  $('#button-cancel-posts').show();
  $('#button-moveup').show().prop("disabled",true);
  $('#button-movedown').show().prop("disabled",true);
  $('#button-update-post').show().prop("disabled",true);
  $('#button-delete-post').show().prop("disabled",true);
  $('#button-new-post').show();
}

function setMenuViewMode(html) {
  $('#menu').html(html);
  $('#button-edit-posts').show();
  $('#button-view-posts').hide();
  $('#button-save-posts').hide();
  $('#button-cancel-posts').hide();
  $('#button-moveup').hide();
  $('#button-movedown').hide();
  $('#button-update-post').hide();
  $('#button-delete-post').hide();
  $('#button-new-post').hide();
}

function setMenuEditItemMode() {
  $('#button-moveup').prop("disabled",false);
  $('#button-movedown').prop("disabled",false);
  $('#button-update-post').prop("disabled",false);
  $('#button-delete-post').prop("disabled",false);
}