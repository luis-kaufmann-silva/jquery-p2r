+(function PullToRefresh__Module($) {
    'use strict';

    // PullToRefresh CLASS DEFINITION
    // ==============================


    var PullToRefresh = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, self.DEFAULTS, options);
        this.flags = {
            moving: false,
            touched: false,
            isTouch: false,
        };

        this.positions = {
            startY: 0,
            startX: 0,
        }
    };


    // infrastucture

    PullToRefresh.key = ['pulltorefresh'].join(".");

    PullToRefresh.DEFAULTS = {
        refresh: 100, // value in "px" to fire "refresh" event
        lockRefresh: false, // indicates that the user can pull up to get the value "refresh"
        resetRefresh: false, // indicates that the "reset" function will be called immediately when occur the event "refresh"
        autoinit: true, // indicates that the "PullToRefresh" object must be built on startup "plugin"
        velocity: "100ms", // velocity of animation in "ms"
        simulateTouch: true, // simulate touch events with mouse events
        tolerance: 10 // integer with the tolerance variation of the y axis
    };

    PullToRefresh.prototype.namespace = function _pulltorefresh__namespace(eventName) {
        var namespace = [
            eventName,
            PullToRefresh.key
        ].join(".");

        return namespace;
    }

    PullToRefresh.debounce = function _pulltorefresh__debounce(func, threshold, context) {

        var timeout;

        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                func.apply(context || obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);

            timeout = setTimeout(delayed, threshold || 300);
        };
    }


    /**
     * Construct method to bind all events to respectives elements
     * @return
     */
    PullToRefresh.prototype.construct = function _pulltorefresh__construct() {
        var self = this;
        if (!(PullToRefresh.support.browser.ie10 || PullToRefresh.support.browser.ie11)) {

            if (PullToRefresh.support.touch) {
                self.$element
                    .on(self.namespace('touchstart'), self.proxy(self.onTouchStart, self))
                    .on(self.namespace('touchmove'), self.proxy(self.onTouchMove, self))
                    .on(self.namespace('touchend'), self.proxy(self.onTouchEnd, self));
            }

            if (self.options.simulatetouch) {
                self.$element
                    .on(self.namespace('mousedown'), self.proxy(self.onTouchStart, self));
                $(document)
                    .on(self.namespace('mousemove'), self.proxy(self.onTouchMove, self))
                    .on(self.namespace('mouseup'), self.proxy(self.onTouchEnd, self));
            }

        } else {
            self.$element
                .on(self.namespace(PullToRefresh.events.start), self.proxy(self.onTouchStart, self))
            $(document)
                .on(self.namespace(PullToRefresh.events.move), self.proxy(self.onTouchMove, self))
                .on(self.namespace(PullToRefresh.events.end), self.proxy(self.onTouchEnd, self));
        }
    };

    /**
     * Destroy method to remove all event listeners of element
     * @return
     */
    PullToRefresh.prototype.destroy = function _pulltorefresh__destroy() {

        this.$element
            .off(this.namespace('touchstart'))
            .off(this.namespace('touchmove'))
            .off(this.namespace('touchend'))
            .off(this.namespace('mousedown'))
            .off(this.namespace(PullToRefresh.events.start));
        $(document)
            .off(this.namespace('mousemove'))
            .off(this.namespace('mouseup'))
            .off(this.namespace(PullToRefresh.events.start))
            .off(this.namespace(PullToRefresh.events.start));

    };

    PullToRefresh.support = {

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

            ie10: !!(window.navigator.msPointerEnabled),
            ie11: !!(window.navigator.pointerEnabled)
        }
    };

    PullToRefresh.events = (function () {

        if (PullToRefresh.support.touch) {
            return {
                start: 'touchstart',
                move: 'touchmove',
                end: 'touchend'
            }
        }

        var events = {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup'
        };

        if (!!(window.navigator.msPointerEnabled)) {
            events = {
                start: 'MSPointerDown',
                move: 'MSPointerMove',
                end: 'MSPointerUp'
            };
        }

        if (!!(window.navigator.pointerEnabled)) {
            events = {
                start: 'pointerdown',
                move: 'pointermove',
                end: 'pointerup'
            };
        }

        return events;

    })();



    PullToRefresh.prototype.proxy = $.proxy;


    // infrastucture

    PullToRefresh.prototype.transform = function _pulltorefresh__transform(style, delta) {
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



    PullToRefresh.prototype.getAxis = function _pulltorefresh__getAxis(event, isTouchEvent) {
        return {
            x: isTouchEvent ? (event.targetTouches || event.originalEvent.targetTouches)[0].pageX : (event.pageX || event.clientX),
            y: isTouchEvent ? (event.targetTouches || event.originalEvent.targetTouches)[0].pageY : (event.pageY || event.clientY)
        }

    }

    PullToRefresh.prototype.onTouchStart = function _pulltorefresh__ontouchstart(event) {
        'use strict';
        var self = this,
            isTouchEvent = event.type === 'touchstart';


        // if not left click
        if (!isTouchEvent && event.which !== 1) {
            return;
        }
        console.log("lol")

        self.flags.touched = true;
        self.flags.isTouch = event.type === 'touchstart';


        // if (self.flags.isTouch !== isTouchEvent) {
        //     return;
        // }

        var axis = self.getAxis(event, isTouchEvent);

        self.positions.startY = axis.y;



        //Start Touches to check the scrolling
        // _this.touches.startX = _this.touches.currentX = pageX;
        // _this.touches.startY = _this.touches.currentY = pageY;

        // _this.touches.start = _this.touches.current = isH ? pageX : pageY;


        this.$element.html("x: " + axis.x + " y: " + axis.y)

        // self.flags.isMoving = true;
        // self.transition(el.style, "0ms");

        // var y = 0;

        // if (evt.touches && evt.touches.length > 0) {
        //   y = (evt.touches[0] || evt.originalEvent.touches[0]).pageY;
        // } else {
        //   y = evt.clientY;
        // }

        // if (!self.startY) {
        //   self.startY = y;
        // }
        // if (self.options.onStart) {
        //   self.options.onStart.apply(el, [self.startY]);
        // }
        self.$element.trigger(self.namespace('start'))
        event.stopPropagation();
        event.preventDefault();
    };


    PullToRefresh.prototype.debouncedOnMove = (function () {
        return PullToRefresh.debounce(function () {
            var self = this;
            self.$element.trigger(self.namespace('move'));
        }, 12, this);
    })()


    PullToRefresh.prototype.onTouchMove = function PullToRefresh__onTouchMove(event) {
        var self = this,
            isTouchEvent = event.type === 'touchmove';


        // if not touched or hasTouchEvent and the eventType is a desktop event cancel the move
        if (!(self.flags.touched) || (self.flags.isTouch && event.type === 'mousemove')) {
            return;
        }

        var axis = self.getAxis(event, isTouchEvent);




        //Start Touches to check the scrolling
        // _this.touches.startX = _this.touches.currentX = pageX;
        // _this.touches.startY = _this.touches.currentY = pageY;

        // _this.touches.start = _this.touches.current = isH ? pageX : pageY;


        this.$element.html("x: " + axis.x + " y: " + axis.y)

        // var y = 0;

        // if (evt.touches && evt.touches.length > 0) {
        //     y = (evt.touches[0] || evt.originalEvent.touches[0]).pageY;
        // } else {
        //     y = evt.clientY;
        // }



        if (!self.positions.startY) {
            self.positions.startY = axis.y;
        }

        var delta = (axis.y - self.positions.startY);

        //console.log(delta)

        // var percent = (delta / self.options.refreshOn) * 100;

        // if (self.options.onMove) {
        //     self.options.onMove.apply(el, [percent]);
        // }

        if (delta >= self.options.refresh) {
            // fire refresh
            // 

            if (self.options.resetRefresh) {
                this.reset();
                return;
            }

            if (self.options.lockRefresh) {
                return;
            }

        }





        // if (delta >= self.options.refreshOn) {
        //     if (self.options.onRefresh) {
        //         self.options.onRefresh.apply(el, [delta]);
        //     }
        //     self.reset(el);
        //     return false;
        // }

        // if (delta <= 0) {
        //     // no move negative
        //     if (self.currentDelta > 0) {
        //         self.currentDelta = 0;
        //         self.transform(el.style, 0);
        //     }
        //     return false;
        // }

        // self.currentDelta = delta;

        //self.debouncedOnMove();
        //self.$element.trigger(self.namespace('move'))
        console.log(delta);
        self.transition(self.$element[0].style, 0)
        delta > 0 && self.transform(self.$element[0].style, delta);
    };

    PullToRefresh.prototype.reset = function PullToRefresh__reset() {
        console.log('reset')
        this.transition(this.$element[0].style, this.options.velocity);
        this.transform(this.$element[0].style, 0);
        this.flags.touched = false;
        this.flags.isTouch = false;
        this.positions.startY = false;
    };

    /**
     * Method to listen the end of touch event
     * @param  {object} event Evento fired by browser
     * @return {void}
     */
    PullToRefresh.prototype.onTouchEnd = function PullToRefresh__onTouchEnd(event) {
        console.log('touchend')
        if (!this.flags.touched) {
            return;
        }
        this.reset();
        this.positions.startY = 0;


        this.$element.trigger(this.namespace('end'));

        event.stopPropagation();
        event.preventDefault();

    };


    // PullToRefresh PLUGIN DEFINITION
    // ========================

    var old = $.fn.pullToRefresh;

    $.fn.pullToRefresh = function _pulltorefresh(option) {
        return this.each(function () {

            var $this = $(this);
            var data = $this.data(PullToRefresh.key);

            var options = $.extend({}, PullToRefresh.DEFAULTS, $this.data(), typeof option == 'object' && option)

            // já esta destruido
            if (!data && option == 'destroy') return

            // se nao existir p2r no elemento, cria
            if (!data) {

                $this.data(PullToRefresh.key, (data = new PullToRefresh(this, options)))

                if (options.autoinit) {

                    data.construct();
                }
            }

            if (typeof option == 'string') {
                data[option].apply(data)
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