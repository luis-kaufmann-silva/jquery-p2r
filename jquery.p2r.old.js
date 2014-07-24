+(function PullToRefresh__Module($) {
    'use strict';

    // PullToRefresh PUBLIC CLASS DEFINITION
    // ==============================

    var PullToRefresh = function (element, options = {}) {
        var self = this;

        self.defaults = {
            refreshOn: 30,
            velocity: "300ms",
            delay: "300ms",
            prefix: 'p2r-'
        };

        self.flags = {
            isTouched: false,
            isTouchEvent: false,
            isMoving: false
        }

        var browserEvents = {
            mousedown: (self.support().browser.ie11 && 'pointerdown') || (self.support().browser.ie10 && 'MSPointerDown') || 'mousedown',
            mousemove: (self.support().browser.ie11 && 'pointermove') || (self.support().browser.ie10 && 'MSPointerMove') || 'mousemove',
            mouseup: (self.support().browser.ie11 && 'pointerup') || (self.support().browser.ie10 && 'MSPointerUp') || 'mouseup'
        }

        self.events = {
            start: self.support().touch ? 'touchstart' : browserEvents.mousedown,
            move: self.support().touch ? 'touchmove' : browserEvents.mousemove,
            end: self.support().touch ? 'touchend' : browserEvents.mouseup
        }



        self.$element = $(element);
        self.options = $.extend({}, self.defaults, options);

        self.startY = null;
        self.currentDelta = null;

        self.setListeners();

    };


    PullToRefresh.prototype.support = function PullToRefresh__support() {

        /** @see https://github.com/nolimits4web/Swiper/blob/848a1129cac59e36279e8b75e7dd3aa2e69bd4cc/src/idangerous.swiper.js#L2753 */
        return {
            touch: (window.Modernizr && Modernizr.touch === true) || (function () {
                'use strict';
                return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
            })(),

            transforms3d: (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
                'use strict';
                var div = document.createElement('div').style;
                return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
            })(),

            transforms: (window.Modernizr && Modernizr.csstransforms === true) || (function () {
                'use strict';
                var div = document.createElement('div').style;
                return ('transform' in div || 'WebkitTransform' in div || 'MozTransform' in div || 'msTransform' in div || 'MsTransform' in div || 'OTransform' in div);
            })(),

            transitions: (window.Modernizr && Modernizr.csstransitions === true) || (function () {
                'use strict';
                var div = document.createElement('div').style;
                return ('transition' in div || 'WebkitTransition' in div || 'MozTransition' in div || 'msTransition' in div || 'MsTransition' in div || 'OTransition' in div);
            })(),

            classList: (function () {
                'use strict';
                var div = document.createElement('div').style;
                return 'classList' in div;
            })(),

            browser: {
                ie8: (function () {
                    'use strict';
                    var rv = -1; // Return value assumes failure.
                    if (navigator.appName === 'Microsoft Internet Explorer') {
                        var ua = navigator.userAgent;
                        var re = new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
                        if (re.exec(ua) !== null)
                            rv = parseFloat(RegExp.$1);
                    }
                    return rv !== -1 && rv < 9;
                })(),

                ie10: window.navigator.msPointerEnabled,
                ie11: window.navigator.pointerEnabled

            }


        }
    }

    PullToRefresh.prototype.setListeners = function PullToRefresh__setListeners() {
        var self = this;
        // @TODO
        self.$element
            .on(self.events.start, self.proxy(self.onTouchStart))
            .on(self.events.move, self.proxy(self.onTouchMove))
            .on(self.events.end, self.proxy(self.onTouchEnd));

    }

    PullToRefresh.prototype.transform = function PullToRefresh__transform(style, delta) {
        style.webkitTransform = 'translate(0, ' + delta + 'px)' + 'translateZ(0)';
        style.msTransform =
            style.MozTransform =
            style.OTransform = 'translateY(' + delta + 'px)';
    };

    PullToRefresh.prototype.transition = function PullToRefresh__transition(style, ms) {
        style.webkitTransitionDuration =
            style.MozTransitionDuration =
            style.msTransitionDuration =
            style.OTransitionDuration =
            style.transitionDuration = ms;
    };






    PullToRefresh.prototype.onTouchStart = function PullToRefresh__onTouchStart(evt, el) {
        console.log('onTouchStart')
        var self = this;

        self.flags.isTouched = true;
        self.flags.isMoving = true;
        self.transition(el.style, "0ms");

        var y = 0;

        if (evt.touches && evt.touches.length > 0) {
            y = (evt.touches[0] || evt.originalEvent.touches[0]).pageY;
        } else {
            y = evt.clientY;
        }

        if (!self.startY) {
            self.startY = y;
        }
        if (self.options.onStart) {
            self.options.onStart.apply(el, [self.startY]);
        }
    };


    PullToRefresh.prototype.onTouchMove = function PullToRefresh__onTouchMove(evt, el) {

        console.log('onTouchMove')
        var self = this;

        // if not touched or hasTouchEvent and the eventType is a desktop event cancel the move
        if (!(self.flags.isTouched) || (self.flags.isTouchEvent && event.type === 'mousemove')) {
            return;
        }

        if (!self.flags.isMoving) {
            return false;
        }
        console.log('AAAA')

        var y = 0;

        if (evt.touches && evt.touches.length > 0) {
            y = (evt.touches[0] || evt.originalEvent.touches[0]).pageY;
        } else {
            y = evt.clientY;
        }



        if (!self.startY) {
            self.startY = y;
        }

        var delta = (y - self.startY);

        var percent = (delta / self.options.refreshOn) * 100;

        if (self.options.onMove) {
            self.options.onMove.apply(el, [percent]);
        }

        if (delta >= self.options.refreshOn) {
            if (self.options.onRefresh) {
                self.options.onRefresh.apply(el, [delta]);
            }
            self.reset(el);
            return false;
        }

        if (delta <= 0) {
            // no move negative
            if (self.currentDelta > 0) {
                self.currentDelta = 0;
                self.transform(el.style, 0);
            }
            return false;
        }

        self.currentDelta = delta;

        self.transform(el.style, delta);
    };

    PullToRefresh.prototype.reset = function PullToRefresh__reset(el) {
        this.transition(el.style, this.options.velocity);
        this.transform(el.style, 0);
        this.isMoving = false;
        this.startY = null;
    };

    PullToRefresh.prototype.onTouchEnd = function PullToRefresh__onTouchEnd(evt, el) {
        console.log('onTouchEnd')
        var self = this;
        if (self.options.onEnd) {
            self.options.onEnd.apply(el, [self.currentDelta]);
        }
        self.reset(el);
        evt.preventDefault();
    };

    PullToRefresh.prototype.proxy = function PullToRefresh__proxy(fn) {
        var self = this;
        var temp = function proxy__fn(evt) {
            var el = this;
            fn.apply(self, [evt, el]);
        };
        return temp;
    };

    PullToRefresh.dataKey = ['luiskaufmannsilva', 'PullToRefresh'].join("__");

    // PullToRefresh PLUGIN DEFINITION
    // ========================

    var old = $.fn.pullToRefresh;

    $.fn.pullToRefresh = function $__pullToRefresh(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data(PullToRefresh.dataKey);
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data(PullToRefresh.dataKey, (data = new PullToRefresh(this, options)));
            }

        });
    };

    $.fn.pullToRefresh.Constructor = PullToRefresh;


    // PullToRefresh NO CONFLICT
    // ==================

    $.fn.pullToRefresh.noConflict = function () {
        $.fn.pullToRefresh = old
        return this
    }

})(window.jQuery || window.Zepto);