+function ($) {
	'use strict';

	// P2R PUBLIC CLASS DEFINITION
	// ==============================

	var P2R = function (element, options) {
		this.$element = $(element)
		this.options = $.extend({}, P2R.DEFAULTS, options);
		
		this.startY = null;
		this.delta = 0;
		this.isMoving = false;
		
		this.init();

	}

	P2R.DEFAULTS = {
		// directions: { // future use
		// 	up: false,
		// 	down: true
		// },
		step: null,
		triggerOn: 30,
		velocity: "300ms",
		onRefresh : null,
	}

	P2R.prototype.onTouchStart = function P2R__onTouchStart(el, evt){
		var x = evt.originalEvent.touches[0].pageY;
		var self = this;
		self.startY = x;

		el.css({
			"webkitTransitionDuration" : "0ms",
			"MozTransitionDuration" : "0ms",
			"msTransitionDuration" : "0ms",
			"OTransitionDuration" : "0ms",
			"transitionDuration" : "0ms",
		});
	}

	P2R.prototype.onTouchMove = function P2R__onTouchMove(el, evt){
		var self = this;
		self.isMoving = true;
		var y = evt.originalEvent.touches[0].pageY;
		if (self.startY < y){
			self.delta = parseInt(y - self.startY);

			var percent = parseInt((self.delta * 100 / self.options.triggerOn));
			
			
			if (self.delta >= self.options.triggerOn){
				self.options.onRefresh && self.options.onRefresh.apply(el, [evt]);

				self.reset(el);
				self.options.step && self.options.step.apply(el, [ 100 ]);

				return false;
			}else{
				if (self.isMoving)
					self.options.step && self.options.step.apply(el, [ percent ]);
			}

			el.css({
				"webkitTransform" : 'translate(0, ' + self.delta + 'px)' + 'translateX(0)',
				"msTransform" : 'translateY(' + self.delta + 'px)',
				"MozTransform" : 'translateY(' + self.delta + 'px)',
				"OTransform" : 'translateY(' + self.delta + 'px)'
			});
		}
	}

	P2R.prototype.reset = function P2R__reset(el){
		var self = this;
		self.isMoving = false;
		el.css({

			"webkitTransitionDuration" : "" + self.options.velocity,
			"MozTransitionDuration" : "" + self.options.velocity,
			"msTransitionDuration" : "" + self.options.velocity,
			"OTransitionDuration" : "" + self.options.velocity,
			"transitionDuration" : "" + self.options.velocity,

			"webkitTransform" : 'translate(0, 0px)' + 'translateX(0)',
			"msTransform" : 'translateY(0px)',
			"MozTransform" : 'translateY(0px)',
			"OTransform" : 'translateY(0px)'
		});
	}

	P2R.prototype.onTouchEnd = function P2R__onTouchEnd(el, evt){
		var self = this;
		if (self.isMoving){
			self.reset(el);
		}

	}
	
	// P2R.prototype.proxy = function P2R__proxy(fn, self){

	// 	fn.self = self;
	// 	return fn;
	// }

	P2R.prototype.init = function P2R__init(){
		var self = this;
		self.
			$element
			.on("touchstart", function P2R__touchstart(evt){
				self.onTouchStart($(this), evt);
			})
			.on("touchmove", function P2R__touchmove(evt){
				self.onTouchMove($(this), evt);
			})
			.on("touchend", function P2R__touchend(evt){
				self.onTouchEnd($(this), evt);
			})
	}

	P2R.dataKey = 'tml.P2R';



	
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