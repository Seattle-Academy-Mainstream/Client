//initialize global variables
var socket;
var Connected = false;
var Posts = {};

// used for the date conversion
var Months = [];
Months[1] = 'january';
Months[2] = 'february';
Months[3] = 'march';
Months[4] = 'april';
Months[5] = 'may';
Months[6] = 'june';
Months[7] = 'july';
Months[8] = 'august';
Months[9] = 'september';
Months[10] = 'october';
Months[11] = 'november';
Months[12] = 'december';

function IsLoggedIn()
{
	var Token = Cookies.get("token");

	if(Token == undefined)
	{
		return false;
	}
	else
	{
		//check if someone is logged in
		socket.emit('checktoken', Token, function(error)
		{
			if(error == "NoToken")
			{
				return false;
			}
			else
			{
				return true;
			}
		});
	}
}

//once the document is ready
$(document).ready(function()
{
	console.log("Initializing Socket.");
	//establish the socket commection
	socket = io.connect('http://strugee.net:10000');


	//once the connection is functional
	socket.on('connect', function()
	{
		Connected = true;

		console.log("Send the Request for the Data.");

		alert(IsLoggedIn());

		//send a request for the whole buffer if the page is the main one
		if(location.pathname == "/ResponsiveApp/index.html")
		{
			socket.emit('update');
		}

		$("#delete-all-button").click(function()
		{
			socket.emit('deleteall');	
		});
	});

	//when data is recieved from the server
	socket.on('update', function (data)
	{
		Posts = JSON.parse(data);
		console.log(Posts);
		FullRender();
	});

	socket.on('updateupvotes', function (data)
	{
		console.log("thing");
		Posts = JSON.parse(data);
		UpdateUpvotes();
	});
});

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
function SendImage(Data, Name, CroppingData, Callback)
{
	socket.emit('image', "{\"Data\": \"" + Data + "\", \"Name\": \"" + Name + "\", \"CroppingData\": " + JSON.stringify(CroppingData) + "}", function()
	{
		Callback();
	});
}

//creates the new post, attaches an image if the image data is set
function NewPostWithoutImage(Content, Username, Callback)
{
	var NewObject = {"Content": Content, "Upvotes": [], "Author": Username, "ID": GenerateID(10), "Category": "none"};
	socket.emit('addpost', JSON.stringify(NewObject), function(data)
	{
		if(data == "NoToken")
		{
			alert("Google has logged you out. Please login again to post.");
			window.location = "sign-in.html";
		}
		else
		{
			//if nothing else has happened, normal callback
			Callback();
		}
	});
}

//automatically uploads the image
function NewPostWithImage(Content, Username, ImageData, ImageFormat, ImageCroppingData, Callback)
{
	var ID = GenerateID(10);

	SendImage(ImageData, ID + "." + ImageFormat, ImageCroppingData, function()
	{
		var NewObject = {"Image": ID + "." + ImageFormat, "Content": Content, "Upvotes": [], "Author": Username, "ID": GenerateID(10), "Category": "none"};
		socket.emit('addpost', JSON.stringify(NewObject), function(data)
		{
			if(data == "NoToken")
			{
				alert("Google has logged you out. Please login again to post.");
				window.location = "sign-in.html";
			}
			else
			{
				//if nothing else has happened, normal callback
				Callback();
			}
		});
	});
}

function Upvote(Object)
{
	var Token = Cookies.get("token");
	var Username = Cookies.get("username");

	if(Username != undefined)
	{
	    if(Username.indexOf("@seattleacademy.org") == -1)
	    {
	      alert("You can't upvote because you aren't logged in with a valid Seattle Academy email address.");
	    }
	    else
	    {
	    	var PostID = $(Object).parents(".post").attr("id");
			socket.emit('upvote', JSON.stringify({"User": Token, "ID": PostID}), function(data)
			{
				if(data == "NoToken")
				{
					alert("Google has logged you out. Please login again to upvote.");
					window.location = "sign-in.html";
				}
			});
	    }
	}
	else
	{
		alert("You can't upvote because you aren't logged in.");
	}
}

function HtmlFromObject(InputObject)
{
	var NewDiv = document.createElement("div");
	$(NewDiv).addClass("post");
	$(NewDiv).attr("id", InputObject["ID"]);

	var FinalDateString = "";

	//gets the date
	var currentdate = new Date(); 
	var Month = currentdate.getMonth() + 1;
	var Day = currentdate.getDate();
	var Year = currentdate.getFullYear();

	//calculates when the post was posted, and converts it to text
	var TimeArray = InputObject["Timestamp"].split("-")

	var PostYear = parseInt(TimeArray[0]);
	var PostMonth = parseInt(TimeArray[1]);
	var PostDay = parseInt(TimeArray[2]);
	var PostMilliseconds = parseInt(TimeArray[3]);

	// set the postdate attribute
	$(NewDiv).attr("data-postdate", PostMilliseconds);

	if(PostYear == Year && PostDay == Day && PostMonth == Month)
	{
		FinalDateString = "today";
	}
	else if(PostYear == Year && PostDay == Day - 1 && PostMonth == Month)
	{
		FinalDateString = "yesterday";
	}
	else
	{
		FinalDateString = "on " + Months[PostMonth] + ", " + PostDay;
	}

	//sets the new div html
	$(NewDiv).html("<div class = \"footer\"><div class = \"author\"><strong class = \"author-text\"></strong> posted " + FinalDateString + "</div></div><table><tr class = \"content\"><td class = \"upvotes\"><div class = \"upvote-icon\" onclick = \"Upvote(this);\"></div><div class = \"upvote-number\"></div></td><td class = \"text\"></td></tr></table><div class = \"post-image\"></div>");
	
	//sets up the differences from the template
	$(NewDiv).find(".text").html(InputObject["Content"]);
	$(NewDiv).find(".upvote-number").html(InputObject["Upvotes"].length);	
	$(NewDiv).find(".author-text").html(InputObject["Author"].replace("@seattleacademy.org", ""));

	//if there is an image
	if(InputObject["Image"] != null)
	{
		$(NewDiv).find(".post-image").html("<img src = \"http://ssh.strugee.net:10000/Images/" + InputObject["Image"] + "\"/>");
	}

	return NewDiv;
}

function UpdateUpvotes()
{
	console.log("update upvotes");
	for(var i = 0; i < Posts.length; i++)
	{
		console.log(Posts[i]["Upvotes"].length);

		$("#" + Posts[i]["ID"] + " .upvote-number").html(Posts[i]["Upvotes"].length);
	}
}

function FullRender()
{
	//appends everything to the #content
	for(var i = 0; i < Posts.length; i++)
	{
		var NewDiv = HtmlFromObject(Posts[i]);

		//adds the new object
		$("#content").append(NewDiv);
	}

	//this sorts the posts by the postdate attribute
	//the newest posts should be at the top
	$('#content .post').sort(function(a, b) 
	{
	     return a.dataset.postdate < b.dataset.postdate;
	}).appendTo('#content');

	//add the <hr/> after every div
	$(".post").after("<hr/>");
}