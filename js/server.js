//initialize global variables
var FirstUpdate = true;
var socket;
var Connected = false;
var Posts = {};

// used for the date conversion
var Months = [];
Months[1] = 'January';
Months[2] = 'February';
Months[3] = 'March';
Months[4] = 'April';
Months[5] = 'May';
Months[6] = 'June';
Months[7] = 'July';
Months[8] = 'August';
Months[9] = 'September';
Months[10] = 'October';
Months[11] = 'November';
Months[12] = 'December';

function IsLoggedIn(Callback)
{
	var Token = Cookies.get("token");

	if(Token == undefined)
	{
		Callback(false);
	}
	else
	{
		//check if someone is logged in
		socket.emit('checktoken', Token, function(error)
		{
			if(error == "NoToken")
			{
				Callback(false);
			}
			else
			{
				Callback(true);
			}
		});
	}
}

function UpdateLoginLogout()
{
	IsLoggedIn(function(LoggedIn)
	{
		console.log("Log Status: " + LoggedIn);

		if(LoggedIn)
		{
			$("#logged-in-username").html(Cookies.get("username").replace("@seattleacademy.org", ""));
			$(".logged-in").show(500);
			$(".logged-out").hide(500);
		}
		else
		{
			$("#logged-in-username").html("Guest");
			$(".logged-in").hide(500);
			$(".logged-out").show(500);
		}

		// no matter what show the text
		$("#logged-in-text").show(500);
	});
}

//once the document is ready
$(document).ready(function()
{
	//hide some things on the page load
	$(".logged-in").hide(0);
	$(".logged-out").hide(0);
	$("#logged-in-text").hide(0);

	console.log("Initializing Socket.");	
	//establish the socket commection
	socket = io.connect('http://strugee.net:10000');

	//once the connection is functional
	socket.on('connect', function()
	{
		Connected = true;

		console.log("Send the Request for the Data.");

		UpdateLoginLogout();

		//send a request for the whole buffer
		socket.emit('update');

		$("#delete-all-button").click(function()
		{
			socket.emit('deleteall');	
		});

		$("#refresh").parent().click(function()
		{
			//send a request for the whole buffer
			socket.emit('update');
		});
	});

	//when data is recieved from the server
	socket.on('update', function (data)
	{
		Posts = JSON.parse(data);
		console.log(Posts);
		FullRender();

		if (FirstUpdate == true)
		{
			InitializeMasonry();
			FirstUpdate = false;
		}

		// whenever we get an update, also update the upvotes
		UpdateUpvotes();
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
			alert("Google has logged you out. Login again to post.");
			window.location = "index.html";
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
    	var PostID = $(Object).parents(".post").attr("id");
		socket.emit('upvote', JSON.stringify({"User": Token, "ID": PostID}), function(data)
		{
			if(data == "NoToken")
			{
				alert("You are no longer logged in. Please login again to upvote.");
			}
		});

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
	$(NewDiv).html("<div class = \"inner-post\"><div class = \"footer\"><div class = \"author\"><strong class = \"author-text\"></strong> posted " + FinalDateString + "</div></div><table><tr class = \"content\"><td class = \"upvotes\"><div class = \"upvote-icon\" onclick = \"Upvote(this);\"></div><div class = \"upvote-number\"></div></td><td class = \"text\"></td></tr></table><div class = \"post-image\"></div></div>");

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
		$("#" + Posts[i]["ID"] + " .upvote-number").html(Posts[i]["Upvotes"].length);

		// if the username is in the array, make the upvote icon a different color
		var Username = Cookies.get("username");
		if ($.inArray(Username, Posts[i]["Upvotes"]) > -1)
		{
			$("#" + Posts[i]["ID"] + " .upvote-icon").addClass("active");
		}
		else
		{
			$("#" + Posts[i]["ID"] + " .upvote-icon").removeClass("active");
		}
	}
}

function FullRender()
{
	//clears the html in the #content field
	$("#content").html("");

	//appends everything to the #content
	for(var i = 0; i < Posts.length; i++)
	{
		var NewDiv = HtmlFromObject(Posts[i]);

		//adds the new object
		$("#content").append(NewDiv)
	}

	//this sorts the posts by the postdate attribute
	//the newest posts should be at the top
	SortedPosts = $('#content .post').sort(function(a, b) 
	{
	     return a.dataset.postdate < b.dataset.postdate;
	})

	// add the newly sorted posts to masonry
	for (i = 0; i < SortedPosts.length; i++)
	{
		if ($posts == null)
		{
			$('#content').append(SortedPosts[i]);
		}
		else
		{
			$('#content').append(SortedPosts[i]).masonry("appended", SortedPosts[i]);
		}
	}

	UpdateLayout();
}