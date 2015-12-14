//global masonry variable
var $posts;

function UpdateLayout()
{
	var $container = $('#masonry');

	$container.imagesLoaded( function() 
	{
		$posts.masonry('layout');
	});
}

function InitializeMasonry()
{
	//on the first update, setup masonry
	$posts = $("#masonry").masonry({
		itemSelector: '.post',
		columnWidth: 150
	});
});