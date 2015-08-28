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

	$('#logout').click(function()
	{
		Cookies.remove("username");
		Cookies.remove("token");

		window.location = "sign-in.html";
	});
});