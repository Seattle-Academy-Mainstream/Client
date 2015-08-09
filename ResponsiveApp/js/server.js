//initialize global variables
var socket;
var Connected = false;
var Posts = {};

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

			console.log("Send the Request for the Data.");

			//send a request for the whole buffer
			socket.emit('update');
		});

		//when data is recieved from the server
		socket.on('update', function (data)
		{
			Posts = JSON.parse(data);
			FullRender();
		});
	});
}

//makes unique ID
function GenerateID(Length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < Length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

//send an image with the image name and the data
function SendImage(Data, Name, CroppingData)
{
	socket.emit('image', "{\"Data\": \"" + Data + "\", \"Name\": \"" + Name + "\", \"CroppingData\": " + JSON.stringify(CroppingData) + "}");
}

//creates the new post, attaches an image if the image data is set
function NewPostWithoutImage(Content, Username)
{
	var NewObject = {"Content": Content, "Upvotes": [], "Author": Username, "ID": GenerateID(10)};
	socket.emit('addpost', JSON.stringify(NewObject));
}

//automatically uploads the image
function NewPostWithImage(Content, Username, ImageData, ImageFormat)
{
	var ID = GenerateID(10);

	SendImage(ImageData, ID + "." + ImageFormat, {});
	var NewObject = {"Image": ID + "." + ImageFormat, "Content": Content, "Upvotes": [], "Author": Username, "ID": GenerateID(10)};
	socket.emit('addpost', JSON.stringify(NewObject));
}

function Upvote(ID)
{
	socket.emit('upvote', JSON.stringify({"User": Username, "ID": ID}));
}

function HtmlFromObject(InputObject)
{
	var NewDiv = document.createElement("div");
	$(NewDiv).addClass("post");
	$(NewDiv).attr("id", InputObject["ID"]);

	//sets the new div html
	$(NewDiv).html("<div class = \"footer\"><div class = \"author\"><strong class = \"author-text\"></strong> posted yesterday</div></div><table><tr class = \"content\"><td class = \"upvotes\"><div class = \"upvote-icon\" onclick = \"ToggleUpvote(this);\"></div><div class = \"upvote-number\"></div></td><td class = \"text\"></td></tr></table><div class = \"post-image\"></div>");
	
	//sets up the differences from the template
	$(NewDiv).filter(".text").html(InputObject["Content"]);
	$(NewDiv).filter(".upvote-number").html(InputObject["Upvotes"]);	
	$(NewDiv).filter(".author-text").html(InputObject["Author"]);

	//if there is an image
	if(InputObject["Image"] != null)
	{
		$(NewDiv).filter(".post-image").html("<img src = \"http://ssh.strugee.net:10000/Images/" + InputObject["Image"] + "\"/>");
	}

	return NewDiv;
}

function FullRender()
{
	for(var i = 0; i < Posts.length; i++)
	{
		var NewDiv = HtmlFromObject(Posts[i]);

		//adds the new object
		$("#content").append(NewDiv);
	}
}