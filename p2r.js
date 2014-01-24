+function ($) {
	'use strict';

	// P2R PUBLIC CLASS DEFINITION
	// ==============================

	var P2R = function (element, options) {
		this.$element = $(element)
		this.options = options;
		
		this.startY = null;
		this.delta = 0;

		this.init();

	}


	P2R.prototype.onTouchStart = function P2R__onTouchStart(evt){
		var x = evt.originalEvent.touches[0].pageY;
		self.startY = x;
		$(this).css({
			"webkitTransitionDuration" : "0ms",
			"MozTransitionDuration" : "0ms",
			"msTransitionDuration" : "0ms",
			"OTransitionDuration" : "0ms",
			"transitionDuration" : "0ms",
		});
	}

	P2R.prototype.onTouchMove = function P2R__onTouchMove(evt){
		var y = evt.originalEvent.touches[0].pageY;
		var $this = $(this);
		if (self.startY < y){
			self.delta = parseInt(y - self.startY);


			// if (delta >= self.options.activate){
			// 	//self.options.onComplete && self.options.onComplete.apply($(this));
			// }

			$this.css({
				"webkitTransform" : 'translate(0, ' + self.delta + 'px)' + 'translateX(0)',
				"msTransform" : 'translateY(' + self.delta + 'px)',
				"MozTransform" : 'translateY(' + self.delta + 'px)',
				"OTransform" : 'translateY(' + self.delta + 'px)'
			});
		}
	}

	P2R.prototype.onTouchEnd = function P2R__onTouchEnd(evt){
		$(this).css({

			"webkitTransitionDuration" : "300ms",
			"MozTransitionDuration" : "300ms",
			"msTransitionDuration" : "300ms",
			"OTransitionDuration" : "300ms",
			"transitionDuration" : "300ms",

			"webkitTransform" : 'translate(0, 0px)' + 'translateX(0)',
			"msTransform" : 'translateY(0px)',
			"MozTransform" : 'translateY(0px)',
			"OTransform" : 'translateY(0px)'
		});
	}
	
	P2R.prototype.proxy = function P2R__proxy(fn){
		console.log(this);
		fn.self = this;
		return fn;
	}

	P2R.prototype.init = function P2R__init(){
		var self = this;
		console.log("PRE");
		console.log(self);
		self.
			$element
			.on("touchstart", self.proxy(self.onTouchStart))
			.on("touchmove", self.proxy(self.onTouchMove))
			.on("touchend", self.proxy(self.onTouchEnd))
		console.log("/INIT");
	}

	P2R.dataKey = 'tml.P2R';

	P2R.DEFAULTS = {
		// directions: { // future use
		// 	up: false,
		// 	down: true
		// },
		step: null,
		activate: 30,
		onComplete : null,
	}


	
	// P2R PLUGIN DEFINITION
	// ========================

	var old = $.fn.pullToRefresh

	$.fn.pullToRefresh = function $__pullToRefresh (option) {
		return this.each(function () {
			var $this = $(this)
			var data = $this.data(P2R.dataKey)
			var options = typeof option == 'object' && option

			if (!data) $this.data(P2R.dataKey, (data = new P2R(this, options)))

			//if (option) data.method(option)
		})
	}

	$.fn.pullToRefresh.Constructor = P2R;


	// P2R NO CONFLICT
	// ==================

	$.fn.pullToRefresh.noConflict = function () {
		$.fn.pullToRefresh = old
		return this
	}


	// // BUTTON DATA-API
	// // ===============

	// $(document).on('click.tml.pulltorefresh.data-api', '[data-toggle^=pulltorefresh]', function (e) {
	// 	var $btn = $(e.target)
	// 	if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
	// 	$btn.button('toggle')
	// 	e.preventDefault()
	// })

}(jQuery);