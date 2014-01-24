$("body").ready(function(){


	$(".refresh-container").pullToRefresh({
		onComplete: function(e){
			alert(e);
		}
	});

});