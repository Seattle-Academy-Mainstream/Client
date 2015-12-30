//global masonry variable
var $posts = null;

function UpdateLayout()
{
	$('#content').imagesLoaded( function() 
	{
		console.log("images loaded, layign out");
		$posts.masonry('layout');
	});
}

function InitializeMasonry()
{
	//on the first update, setup masonry
	$posts = $("#content").masonry({
		columnWidth: '.post',
		itemSelector: '.post',
		percentPosition: true
	});
}