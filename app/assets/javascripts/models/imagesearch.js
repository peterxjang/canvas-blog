function newImageSearch(e) {
  e.preventDefault();
  $('#link-image-search').bind('click', false);
  $('#link-image-search').text('Searching...');
  resetImageResults();
  $.ajax({
    url: '/amazon_image_search',
    type: 'GET',
    dataType: 'json',
    data: $("form#form-create-post").serialize(),
    success: function(response) {
      if (response.valid) {
        for(var i=0;i<response.items.length; i++) {
          var src_large = response.items[i].src_large
          var src_small = response.items[i].src_small
          var title = response.items[i].title
          $('#image-search-thumbnails').append(
            '<a class="image-thumbnail" href="' + src_large + '" alt="' + title + '"><img src="' + src_small + '"></a>'
          );
          if (i==0) {
		        $('#image-search-selected').html('<p>' + title + '</p>');
		        $('#image-search-selected').append('<img src="' + src_large + '" alt="' + title + '">');
          }
        }
        $('.image-thumbnail').on('click', selectThumbnail);
        $('#image-search-selected').on('click', selectImage);
      }
      else { console.log("Could not find images!"); }
    },
    error: function(response) { console.log("image search error!"); console.log(response); },
    complete: function(response) { 
      $('#link-image-search').unbind('click', false); 
      $('#link-image-search').text('Search');
    }
  });
}

function selectThumbnail(e) {
  e.preventDefault();
  $('#image-search-selected').css('opacity', 0.5);
  var newImage = new Image();
  var title = $(this).attr("alt");
  $(newImage).load(function (event) {
      $('#image-search-selected').html('<p>' + title + '</p>');
      $('#image-search-selected').append(newImage);
      $('#image-search-selected').css('opacity', 1.0);
  });
  $(newImage).attr("src", $(this).attr("href"));
  $(newImage).attr("alt", title);
}

function selectImage(e) {
  e.preventDefault();
  $("#title").attr('value', $(e.target).attr("alt"));
  $("#new-filename").attr('value', $(e.target).attr("src"));
  // setBackground($('#title'), $(e.target).attr("src"));
  // setBackground($('#textarea-body'), $(e.target).attr("src"));
  $("#div-image-thumbnail").html("<img id='img-thumbnail' src='" +  $(e.target).attr("src") + "'>");
  $('#div-image-search').remove();
  $('#div-post-details').show();
}

function resetImageResults() {
  $('#image-search-selected').empty();
  $('#image-search-thumbnails').empty();
}

function setBackground(item, src) {
	item.css('background', 'url(' + src + ') no-repeat center center fixed');
	item.css('background-size', 'cover');
}
