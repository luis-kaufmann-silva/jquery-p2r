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
            refreshed: false,
        };

        this.positions = {
            startY: 0,
            startX: 0,
            lastStep: 0,
        }
    };


    // infrastucture

    PullToRefresh.key = 'pulltorefresh';

    PullToRefresh.DEFAULTS = {
        sensibility: 10, // number of pixels to each call of "move" event
        refresh: 100, // value in pixels to fire "refresh" event
        lockRefresh: false, // indicates that the user can pull up to get the value "refresh"
        resetRefresh: false, // indicates that the "reset" function will be called immediately when occur the event "refresh"
        autoInit: true, // indicates that the "PullToRefresh" object must be built on startup "plugin"
        resetVelocity: "100ms", // velocity of reset animation in milliseconds
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

            if (self.options.simulateTouch) {
                self.$element
                    .on(self.namespace('mousedown'), self.proxy(self.onTouchStart, self));
                $(document)
                    .on(self.namespace('mousemove'), self.$element, self.proxy(self.onTouchMove, self))
                    .on(self.namespace('mouseup'), self.$element, self.proxy(self.onTouchEnd, self));
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



    PullToRefresh.prototype.proxy = (function () {

        var has_bind = !!(Function.prototype.bind);


        if (has_bind) {

            return function _pulltorefresh__bind(fn, context) {
                return fn.bind(context);
            }
        } else {
            if ($.proxy) {
                return $.proxy;
            } else {
                return function _pulltorefresh__jquery_like_proxy(fn, context) {
                    var tmp, args, proxy;

                    if (typeof context === "string") {
                        tmp = fn[context];
                        context = fn;
                        fn = tmp;
                    }

                    // Quick check to determine if target is callable, in the spec
                    // this throws a TypeError, but we will just return undefined.
                    if (typeof (fn) === 'function') {
                        return undefined;
                    }

                    args = Array.prototype.slice.call(arguments, 2);

                    // Simulated bind
                    proxy = function () {
                        return fn.apply(context || this, args.concat(slice.call(arguments)));
                    };

                    // Set the guid of unique handler to the same of original handler, so it can be removed
                    proxy.guid = fn.guid = fn.guid || jQuery.guid++;

                    return proxy;
                }
            }
        }

    })();

    // infrastucture

    PullToRefresh.prototype.transform = function _pulltorefresh__transform(style, delta) {

        style.webkitTransform = 'translate(0, ' + delta + 'px) ' + 'translateZ(0)';
        style.msTransform =
            style.MsTransform =
            style.MozTransform =
            style.OTransform =
            style.transform = 'translateY(' + delta + 'px)';
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
        var isTouchEvent = event.type === 'touchstart';



        // if not left click
        if (!isTouchEvent && event.which !== 1) {
            return;
        }

        this.flags.touched = true;
        this.flags.refreshed = false;
        this.flags.isTouch = event.type === 'touchstart';


        // if (this.flags.isTouch !== isTouchEvent) {
        //     return;
        // }

        var axis = this.getAxis(event, isTouchEvent);

        this.positions.startY = axis.y;
        this.positions.startX = axis.x;



        //Start Touches to check the scrolling
        // _this.touches.startX = _this.touches.currentX = pageX;
        // _this.touches.startY = _this.touches.currentY = pageY;

        // _this.touches.start = _this.touches.current = isH ? pageX : pageY;




        // this.flags.isMoving = true;
        // this.transition(el.style, "0ms");

        // var y = 0;

        // if (evt.touches && evt.touches.length > 0) {
        //   y = (evt.touches[0] || evt.originalEvent.touches[0]).pageY;
        // } else {
        //   y = evt.clientY;
        // }

        // if (!this.startY) {
        //   this.startY = y;
        // }
        // if (this.options.onStart) {
        //   this.options.onStart.apply(el, [this.startY]);
        // }
        this.$element.trigger(this.namespace('start'))
        this.transition(this.$element[0].style, "0ms");
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

        var isTouchEvent = event.type === 'touchmove',
            delta,
            step,
            percentage,
            axis;

        // if not touched or hasTouchEvent and the eventType is a desktop event cancel the move
        if (!(this.flags.touched) || (this.flags.isTouch && event.type === 'mousemove')) {
            return;
        }

        // get axis pair
        axis = this.getAxis(event, isTouchEvent);

        // get variation of position between start y axis and current y axis
        delta = (axis.y - this.positions.startY);

        // reset on horizontal scroll tolerance fail
        if ((axis.x - this.positions.startX) > this.options.tolerance) {
            this.reset();
            return;
        }

        if (delta < 0) return;

        // fires the refresh event if necessary and not has been triggered before
        if (delta >= this.options.refresh && !this.flags.refreshed) {
            // fire refresh event
            this.$element.trigger(this.namespace('refresh'));

            // set flag to not trigger this event until next touchend
            this.flags.refreshed = true;

            // if configured to reset on refresh, do it
            if (this.options.resetRefresh) {
                this.reset();
                return;
            }

            if (this.options.lockRefresh) {
                return;
            }

        }

        // current step, necessary to define if call move event
        step = parseInt(delta / this.options.sensibility, 10);

        // if is a next step, fire event and inform the perncentage of pull
        if (this.positions.lastStep != step) {
            this.positions.lastStep = step;
            percentage = parseInt(delta / 100 * this.options.refresh, 10);
            this.$element.trigger(this.namespace('move'), percentage);
        }


        // finally tranform element to current touch position
        this.transform(this.$element[0].style, delta);

    };


    PullToRefresh.prototype.reset = function PullToRefresh__reset() {
        this.transition(this.$element[0].style, this.options.resetVelocity);
        this.transform(this.$element[0].style, 0);
        this.flags.touched = false;
        this.flags.isTouch = false;
        this.flags.refreshed = false;
        this.positions.startY = false;
    };

    /**
     * Method to listen the end of touch event
     * @param  {object} event Event triggered by browser
     * @return {void}
     */
    PullToRefresh.prototype.onTouchEnd = function PullToRefresh__onTouchEnd(event) {
        if (!this.flags.touched) {
            return;
        }

        this.positions.startY = 0;
        this.positions.startX = 0;

        this.reset();

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

                if (options.autoInit) {

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

    // $(document).on('click.' + PullToRefresh.key + '.data-api', '[data-toggle="pulltorefresh"]', function (e) {
    //     var $this = $(this)
    //     var href = $this.attr('href')
    //     var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    //     var option = $target.data('bs.modal') ? 'toggle' : $.extend({
    //         remote: !/#/.test(href) && href
    //     }, $target.data(), $this.data())

    //     if ($this.is('a')) e.preventDefault()

    //     $target.one('show.bs.modal', function (showEvent) {
    //         if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
    //         $target.one('hidden.bs.modal', function () {
    //             $this.is(':visible') && $this.trigger('focus')
    //         })
    //     })
    //     Plugin.call($target, option, this)
    // })


})(window.jQuery || window.Zepto);