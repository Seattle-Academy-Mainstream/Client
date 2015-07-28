var Placeholder = "What's on your mind?";

function ShowImageUpload()
{
  $("#image-upload").slideDown(500);
}

//clear the text box placeholder
function TextboxFocus(Item)
{
  //if the text is equal to the placeholder, get rid of it and change the styling
  if($(Item).html() == Placeholder)
  {
    $(Item).removeClass("dim-text");
    $(Item).html("");
  }
}

$(document).ready(function()
{
  //setup the placeholder
  $("#textarea").html(Placeholder);

  //once the image has loaded
  $('img#thepicture').on('load', function()
  {
    var picture = $('#thepicture');  // Must be already loaded or cached!
    //sets up the cropper
    picture.guillotine({width: 640, height: 480});

    for(var i = 0; i < 10; i++)
    {
      picture.guillotine('zoomOut');
    }

    picture.guillotine('center');

    //hide the image bar
    $("#image-upload").hide(0);

    $('#zoom-in-button').click(function(){
      picture.guillotine('zoomIn');
    });
    $('#zoom-out-button').click(function(){
      picture.guillotine('zoomOut');
    });
    $('#rotate-right-button').click(function(){
      picture.guillotine('rotateRight');
    });
    $('#rotate-left-button').click(function(){
      picture.guillotine('rotateLeft');
    });
  });
});