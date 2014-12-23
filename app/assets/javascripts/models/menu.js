function createMenu() {
  $(document).on("click", "#button-edit-posts", editLayout);
  $(document).on("click", "#button-save-posts", saveLayout);
  $(document).on("click", "#button-cancel-posts", cancelLayout);
  $(document).on("click", "#button-new-post", newPost);
  $(document).on("click", "#button-create-post", function(e) {
    e.preventDefault();
    hidePopup();
    createPost();
  });
  $(document).on("click", "#button-edit-background", editBackground);
  $(document).on("click", "#button-update-background", function(e) {
    e.preventDefault();
    hidePopup();
    updateBackground();
  });
  // $(document).on("click", "#button-update-post", function(e) {
  //   e.preventDefault();
  //   hidePopup();
  //   updatePost($(this).attr('data'));
  // });
  // $(document).on("click", "#button-delete-confirmed", function(e) {
  //   e.preventDefault();
  //   hidePopup();
  //   deletePostConfirmed(currentGroup.attrs.id);
  // });

  $(document).on("click", "#link-image-search", newImageSearch);
}

function setMenuEditMode(html) {
  $('#menu').html(html);
  $('#button-edit-posts').hide();
  $('#button-save-posts').show();
  $('#button-cancel-posts').show();
  $('#button-new-post').show();
  $('#button-edit-background').show();
}

function setMenuViewMode(html) {
  $('#menu').html(html);
  $('#button-edit-posts').show();
  $('#button-save-posts').hide();
  $('#button-cancel-posts').hide();
  $('#button-new-post').hide();
  $('#button-edit-background').hide();
}

function setMenuEditItemMode() {
  var state = currentGroup === null;
  $('#button-moveup').prop("disabled",state);
  $('#button-movedown').prop("disabled",state);
  $('#button-edit-post').prop("disabled",state);
  $('#button-delete-post').prop("disabled",state);
}