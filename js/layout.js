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

$(document).ready(function()
{
	//on the first update, setup masonry
	$posts = $("#masonry").masonry({
		itemSelector: '.post',
		columnWidth: 150
	});
});