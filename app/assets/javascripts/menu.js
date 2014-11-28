function createMenu() {
  $(document).on("click", "#button-edit-posts", editLayout);
  $(document).on("click", "#button-save-posts", saveLayout);
  $(document).on("click", "#button-cancel-posts", cancelLayout);
  $(document).on("click", "#button-view-posts", viewLayout);
}

function setMenuEditMode(html) {
  $('#menu').html(html);
  $('#button-edit-posts').hide();
  $('#button-view-posts').hide();
  $('#button-save-posts').show();
  $('#button-cancel-posts').show();
}

function setMenuViewMode(html) {
  $('#menu').html(html);
  $('#button-edit-posts').show();
  $('#button-view-posts').hide();
  $('#button-save-posts').hide();
  $('#button-cancel-posts').hide();
}