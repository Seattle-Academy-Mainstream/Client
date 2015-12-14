//global masonry variable
var $posts;

function UpdateLayout()
{
	var $container = $('#content');

	$container.imagesLoaded( function() 
	{
		$posts.masonry('layout');
	});
}

function InitializeMasonry()
{
	//on the first update, setup masonry
	$posts = $("#content").masonry({
		itemSelector: '.post',
		columnWidth: 350
	});
}