var Placeholder = "What's on your mind?";
var picture;

function BindUpvote(ID)
{
  //binds the button to the dom node
  $("#" + ID + " .upvote-button").click(function()
  {
    Upvote($(this).parent().parent().attr('id'));
  });
}

function PostPost()
{
  var Username = "isaaczinda";

  //if a picture is attached, get the picture data
  if($("#thepicture").attr("src") != "")
  {
    var Data = picture.guillotine("getData");
    
    var ImageSource = $("#thepicture").attr("src");

    ImageSource = ImageSource.replace("data:" + $("#thepicture").attr("type") + ";base64,", "");

    //upload the post with the image
    NewPostWithImage($("#textarea").html(), Username, ImageSource, $("#thepicture").attr("extension"));
  }
  else
  {
    NewPostWithoutImage($("#textarea").html(), Username);
  }

  alert("Posted Post.");

  window.location = "index.html";
}

function GetExtension(filename)
{
  var a = filename.split(".");
  if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
      return "";
  }
  return a.pop().toLowerCase();
}

function ImageUploaded()
{
  var file = document.querySelector('input[type=file]').files[0]; //sames as here
  var reader = new FileReader();

  reader.onload = function() 
  {
    //set the src attribute
    var Data = event.target.result;
    $("#thepicture").attr("src", Data);

    //set the text to the filename.
    var FileType = file.type;
    var Filename = file.name;
    var Extension = GetExtension(file.name);

    //set the type attribute
    $("#thepicture").attr("type", FileType);

    //store the extension
    $("#thepicture").attr("extension", Extension);

    $("#image-name").html(Filename);

    //slide down the image panel
    $("#image-crop").slideDown(500);
  }

  reader.readAsDataURL(file); //reads the data as a URL
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
  //hide the image bar
  $("#image-crop").hide(0);

  //setup the placeholder
  $("#textarea").html(Placeholder);

  //once the image has loaded
  $('#thepicture').on('load', function()
  {
    picture = $('#thepicture');  // Must be already loaded or cached!

    //reset
    picture.guillotine('remove');

    //sets up the cropper
    picture.guillotine({width: 640, height: 480});

    for(var i = 0; i < 10; i++)
    {
      picture.guillotine('zoomOut');
    }

    picture.guillotine('center');

    $('#zoom-in-button').click(function(){
      picture.guillotine('zoomIn');
    });
    $('#zoom-out-button').click(function(){
      picture.guillotine('zoomOut');
    });
    $('#rotate-right-button').click(function(){
      picture.guillotine('rotateLeft');
    });
    $('#rotate-left-button').click(function(){
      picture.guillotine('rotateRight');
    });
  });
});