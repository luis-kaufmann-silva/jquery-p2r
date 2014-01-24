$("body").ready(function(){


	$(".refresh-container").pullToRefresh({
		step: function(percent){
			var deg = (180 - (percent * 180 / 100))
			$("#indicator").css("transform", "rotate("+deg+"deg)");
		},
		cancelOnTrigger: true,
		triggerOn: 80,
		onRefresh: function(e){
			
		}
	});

});