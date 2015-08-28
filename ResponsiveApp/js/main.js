function ToggleSettings()
{
	$("#settings-bar").slideToggle(500);
}

function Refresh()
{
	alert("Refreshed Page.");
}

function ToggleUpvote(Object)
{
	$(Object).toggleClass("active");

	alert("Upvoted a Post.");
}

$(document).ready(function()
{
	$("#settings-bar").hide(0);

	$("#logout").click(function()
	{
		console.log("logout clciked");
		
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () 
		{
			console.log('User signed out.');
				//unset cookie
			Cookies.remove("token");

			window.location = "sign-in.html";
		});
	});
});