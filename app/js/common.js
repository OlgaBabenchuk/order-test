$(document).ready(function() {

	$(".title-info__title").each(function(){
		var review_full = $(this).html();
		var review = review_full;
		if( review.length > 42 )
		{
			review = review.substring(0, 42);
			$(this).html( review + '...' );
		}
	});
});