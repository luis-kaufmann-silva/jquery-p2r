jQuery - Pull to Refresh
==========

A simple jQuery plugin to perform pull to refresh (p2r). Example of use:

```js
$(".refresh-container").pullToRefresh({
		onMove: function onMove(percent){
			// move to down
		},
		onStart: function onStart(y){
			// start callback
		},
		onEnd: function onEnd(delta){
			// on end callback (after onRefresh)
		},
		onRefresh : function onRefresh(delta){
			// on delta => refreshOn
		},

		refreshOn: 120,// (int) px to refresh
		velocity: "1000ms", // (string) transition velocity
	});
```

See [this demo][1] (needs touch support)


  [1]: http://luis-kaufmann-silva.github.io/jquery-p2r/demo/index.html