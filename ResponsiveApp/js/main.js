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

	console.log($.cookie("username"));
});