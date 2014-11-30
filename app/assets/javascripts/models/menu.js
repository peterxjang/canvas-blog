function createMenu() {
  $(document).on("click", "#button-edit-posts", editLayout);
  $(document).on("click", "#button-save-posts", saveLayout);
  $(document).on("click", "#button-cancel-posts", cancelLayout);
  $(document).on("click", "#button-view-posts", viewLayout);
  $(document).on("click", "#button-moveup", moveObjectUp);
  $(document).on("click", "#button-movedown", moveObjectDown);
  $(document).on("click", "#button-edit-post", function(e) {
    editPost(currentGroup.attrs.id);
  });
  $(document).on("click", "#button-delete-post", function(e) {
    deletePost(currentGroup.attrs.id);
  });
  $(document).on("click", "#button-new-post", function(e) {
    newPost();
  });
  $(document).on("click", "#button-update-post", function(e) {
    e.preventDefault();
    hidePopup();
    updatePost($(this).attr('data'));
  });
  $(document).on("click", "#button-create-post", function(e) {
    e.preventDefault();
    hidePopup();
    createPost();
  });
}

function setMenuEditMode(html) {
  $('#menu').html(html);
  $('#button-edit-posts').hide();
  $('#button-view-posts').hide();
  $('#button-save-posts').show();
  $('#button-cancel-posts').show();
  $('#button-moveup').show().prop("disabled",true);
  $('#button-movedown').show().prop("disabled",true);
  $('#button-edit-post').show().prop("disabled",true);
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
  $('#button-edit-post').hide();
  $('#button-delete-post').hide();
  $('#button-new-post').hide();
}

function setMenuEditItemMode() {
  var state = currentGroup === null;
  $('#button-moveup').prop("disabled",state);
  $('#button-movedown').prop("disabled",state);
  $('#button-edit-post').prop("disabled",state);
  $('#button-delete-post').prop("disabled",state);
}