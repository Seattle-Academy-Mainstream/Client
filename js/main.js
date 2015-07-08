$(document).ready(function()
{
	//show and hide the correct things
	$(".new-post").hide(0);
	$(".home").hide(0);
    $(".logged-out").show(0);
	$(".logged-in").hide(0);

	//show the all tab
	$("#Posts all").show(0);

	//when any of the categories bar is clicked
	$(".categories a").click(function()
	{
		//remove all the active classes
		$(".categories li").removeClass("active");

		//add the active class to the current tab
		$(this).parent().addClass("active");

		//hide all of the divs
		$("#Posts > div").fadeOut(0);

		//show the certain ones
		var Category = $(this).parent().attr("category");
		console.log(Category);
		$("#Posts ." + Category).fadeIn(500);

		//layout the posts
      	//$('#Posts').masonry( 'layout');
	});

	$(".new-post-button").click(function()
	{
		$(".home").fadeOut(0);
		$(".new-post").fadeIn(500);
	});

	$(".back-button").click(function()
	{
		$(".home").fadeIn(500);
		$(".new-post").fadeOut(0);
	});
	$(".post-submit-button").click(function() 
	{
		if(Connected)
		{
			var Category = $(".choose-category").val();
			if(Category != undefined)
			{
				NewPost($(".post-textbox").val(), Category);
				console.log($(".post-textbox").val());
			}
			else
			{
				alert("Choose a Category.");
			}
		}
		else
		{
			alert("Not Connected Yet.");
		}
	});
});