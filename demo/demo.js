$("body").ready(function(){


	var indicator = $("#indicator");

	$(".refresh-container").pullToRefresh({
		onMove: function onMove(percent){
			//indicator.append("MOVE<br>");
			indicator.html("Pulling");
		},
		onStart: function onStart(y){
			indicator.html("Start pull");
		},
		onEnd: function onEnd(delta){
			indicator.append("<br>Stop pull");
		},
		onRefresh : function onRefresh(delta){
			indicator.html("REFRESH \\o/");
			alert("REFRESH")
		},

		refreshOn: 120,
		velocity: "1000ms",
	});

});