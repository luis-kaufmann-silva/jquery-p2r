+function ($) {
	'use strict';

	// P2R PUBLIC CLASS DEFINITION
	// ==============================

	var P2R = function (element, options) {
		
		this.$element = $(element)
		this.options = $.extend({}, P2R.DEFAULTS, options);
		
		this.startY = null;
		this.isMoving = null;
		this.currentDelta = null;

		this.init();

	}

	P2R.DEFAULTS = {
		onMove: null,
		onStart: null,
		onEnd: null,
		onRefresh : null,
		refreshOn: 30,
		velocity: "300ms",
	}

	P2R.prototype.transform = function P2R__transform(style, delta){
		style.webkitTransform = 'translate(0, ' + delta + 'px)' + 'translateZ(0)';
		style.msTransform =
		style.MozTransform =
		style.OTransform = 'translateY(' + delta + 'px)';
	}

	P2R.prototype.transition = function P2R__transition(style, ms){
		style.webkitTransitionDuration =
		style.MozTransitionDuration =
		style.msTransitionDuration =
		style.OTransitionDuration =
		style.transitionDuration = ms;
	}

	P2R.prototype.onTouchStart = function P2R__onTouchStart(evt, el){
		var self = this;
		self.transition(el.style, "0ms");
		
		if(!self.startY){
			self.startY = evt.originalEvent.touches[0].pageY;
		}
		self.isMoving = true;
		self.options.onStart && self.options.onStart.apply(el, [self.startY])
	}

	
	P2R.prototype.onTouchMove = function P2R__onTouchMove(evt, el){
		var self = this;
		
		if(!self.isMoving){
			return false;
		}
		
		var y = evt.originalEvent.touches[0].pageY;

		if(!self.startY){
			self.startY = y;
		}

		var delta = (y - self.startY);

		var percent = ( delta / self.options.refreshOn ) * 100;

		self.options.onMove && self.options.onMove.apply(el, [percent])

		if (delta >= self.options.refreshOn){
			self.options.onRefresh && self.options.onRefresh.apply(el, [delta])
			self.reset(el);
			return false;
		}

		if (delta <= 0){
			// no move negative
			if (self.currentDelta > 0){
				self.currentDelta = 0;
				self.transform(el.style, 0);
			}
			return false;
		}

		self.currentDelta = delta;
		
		self.transform(el.style, (delta));
	}

	P2R.prototype.reset = function P2R__reset(el){
		this.transition(el.style, this.options.velocity)
		this.transform(el.style, 0);
		this.isMoving = false;
		this.startY = null;
	}

	P2R.prototype.onTouchEnd = function P2R__onTouchEnd(evt, el){
		var self = this;
		self.options.onEnd && self.options.onEnd.apply(el, [self.currentDelta])
		self.reset(el);
	}
	
	P2R.prototype.proxy = function P2R__proxy(fn){
		var self = this;
		var temp = function proxy__fn(evt){
			var el = this;
			fn.apply(self, [evt, el])
		}
		return temp;
	}

	P2R.prototype.init = function P2R__init(){
		var self = this;
		self.
			$element
				.on("touchstart", self.proxy(self.onTouchStart))
				.on("touchmove", self.proxy(self.onTouchMove))
				.on("touchend", self.proxy(self.onTouchEnd));
	}

	P2R.dataKey = 'k.P2R';
	
	// P2R PLUGIN DEFINITION
	// ========================

	var old = $.fn.pullToRefresh

	$.fn.pullToRefresh = function $__pullToRefresh (option) {
		return this.each(function () {
			var $this = $(this)
			var data = $this.data(P2R.dataKey)
			var options = typeof option == 'object' && option

			if (!data) $this.data(P2R.dataKey, (data = new P2R(this, options)))

		})
	}

	$.fn.pullToRefresh.Constructor = P2R;


	// P2R NO CONFLICT
	// ==================

	$.fn.pullToRefresh.noConflict = function () {
		$.fn.pullToRefresh = old
		return this
	}

}(jQuery);