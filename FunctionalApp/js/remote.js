//initialize global variables
var socket;
var Connected = false;
var Posts = {};
var Username = "";
var ImageData = {"Data": "", "Format": ""};

function InitializeServer()
{
	//once the document is ready
	$(document).ready(function()
	{
		//establish the socket commection
		socket = io.connect('http://ssh.strugee.net:10000');

		//once the connection is functional
		socket.on('connect', function()
		{
			Connected = true;

			console.log("Send the Request for the Data.")
			//send a request for the whole buffer
			socket.emit('initial');
		});

		//when data is recieved from the server
		socket.on('initial', function (data)
		{
			Posts = JSON.parse(data);
			InitialHtmlSetup();
		});

		//when data is recieved from the server
		socket.on('update', function (data)
		{
			Update(data);
		});
	});
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
  	ImageData["Data"] = event.target.result.replace("data:"+ file.type +";base64,", '');
  	ImageData["Format"] = GetExtension(file.name);
  }

  reader.readAsDataURL(file); //reads the data as a URL
}

function IndexFromID(ID)
{
	for (var i = 0; i < Posts.length; i++)
	{
		if(ID == Posts[i]["ID"])
		{
			return i;
		}
	}
	return -1;
}

function GenerateID(Length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < Length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function SendImage(data, Name)
{
	socket.emit('image', "{\"Data\": \"" + data + "\", \"Name\": \"" + Name + "\"}");
}

function NewPost(Content, Category)
{
	if(ImageData["Data"] != "")
	{
		var ID = GenerateID(10);
    	SendImage(ImageData["Data"], ID + "." + ImageData["Format"]);
		var NewObject = {"Category": Category, "Image": ID + "." + ImageData["Format"], "Content": Content, "Upvotes": [], "Author": Username, "ID": GenerateID(10)};
		socket.emit('update', JSON.stringify(NewObject));
	}
	else
	{
		var NewObject = {"Category": Category, "Content": Content, "Upvotes": [], "Author": Username, "ID": GenerateID(10)};
		socket.emit('update', JSON.stringify(NewObject));
	}
	
	ImageData["Data"] = "";
	ImageData["Format"] = "";
}

function Upvote(ID)
{
	socket.emit('upvote', JSON.stringify({"User": Username, "ID": ID}));
}

function Update(data)
{
	var NewObject = JSON.parse(data);

	var Index = IndexFromID(NewObject["ID"]);

	if(Index >= 0)
	{
		Posts[Index] = NewObject;
		
		// get the HTML from the object
		var HTML = $(HtmlFromObject(NewObject)).html();

		//add the html to the dom
		$("#" + NewObject["ID"]).html(HTML);

		BindUpvote(NewObject["ID"]);

		console.log("Layout");
	}
	else
	{
		Posts.push(NewObject);

		var NewDiv = HtmlFromObject(NewObject);

		//adds the new object
		$("#Posts").append(NewDiv);

		BindUpvote(NewObject["ID"]);
	}
}

function BindUpvote(ID)
{
	//binds the button ot the dom node
	$("#" + ID + " .upvote-button").click(function()
	{
		Upvote($(this).parent().parent().attr('id'));
	});
}

function HtmlFromObject(InputObject)
{
	var NewDiv = document.createElement("div");
	$(NewDiv).addClass("masonary-brick all col-sm-6 col-sm-offset-3");
	$(NewDiv).addClass(InputObject["Category"]);
	$(NewDiv).attr("id", InputObject["ID"]);

	//uses a special thing if we have upvoted
	var Upvoted = false;
	for(var i = 0; i < InputObject["Upvotes"].length; i++)
	{
		if(InputObject["Upvotes"][i] == Username)
		{
			Upvoted = true;
		}
	}
	
	if(Upvoted)
	{
		$(NewDiv).append("<div class = 'col-sm-8'><h3>" + InputObject["Content"] + "</h3><button type='button' class = 'btn btn-default upvote-button'>Remove Upvote</button><h5>" + InputObject["Upvotes"].length + " Upvotes</h5><h5>" + InputObject["Author"] + "</h5></div>");
	}
	else
	{		
		$(NewDiv).append("<div class = 'col-sm-8'><h3>" + InputObject["Content"] + "</h3><button type='button' class = 'btn btn-default upvote-button'>Upvote</button><h5>" + InputObject["Upvotes"].length + " Upvotes</h5><h5>" + InputObject["Author"] + "</h5></div>");
	}

	if(InputObject["Image"] != null)
	{
		$(NewDiv).append("<div class = 'col-sm-4'><img src = \"http://ssh.strugee.net:10000/Images/" + InputObject["Image"] + "\"/></div>");
	}

	return NewDiv;
}

function InitialHtmlSetup()
{
	for(var i = 0; i < Posts.length; i++)
	{
		var NewDiv = HtmlFromObject(Posts[i]);

		//adds the new object
		$("#Posts").append(NewDiv);

		//binds the button
		BindUpvote(Posts[i]["ID"]);
	}
}