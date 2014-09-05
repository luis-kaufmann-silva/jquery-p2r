+(function _pulltorefresh__module($) {
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


    // static vars

    // namespace to events
    PullToRefresh.key = 'pulltorefresh';

    // default options
    PullToRefresh.DEFAULTS = {
        sensibility: 5, // number of pixels to each call of "move" event
        refresh: 200, // value in pixels to fire "refresh" event
        lockRefresh: false, // indicates that the user can pull up to get the value "refresh"
        resetRefresh: false, // indicates that the "reset" function will be called immediately when occur the event "refresh"
        autoInit: true, // indicates that the "PullToRefresh" object must be built on startup "plugin"
        resetSpeed: "100ms", // speed of reset animation in milliseconds
        simulateTouch: true, // simulate touch events with mouse events
        threshold: 20 // integer with the threshold variation of the y axis
    };

    // namespace function to join event.namespace
    PullToRefresh.namespace = function _pulltorefresh__namespace(eventName) {
        return [
            eventName,
            PullToRefresh.key
        ].join(".");
    }

    // support detection on touch events
    PullToRefresh.support = {

        touch: (window.Modernizr && Modernizr.touch === true) || (function () {
            'use strict';
            return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
        })(),

        // TODO future use
        // transforms3d: (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
        //     'use strict';
        //     var div = document.createElement('div').style;
        //     return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
        // })(),

        // transforms: (window.Modernizr && Modernizr.csstransforms === true) || (function () {
        //     'use strict';
        //     var div = document.createElement('div').style;
        //     return ('transform' in div || 'WebkitTransform' in div || 'MozTransform' in div || 'msTransform' in div || 'MsTransform' in div || 'OTransform' in div);
        // })(),

        // transitions: (window.Modernizr && Modernizr.csstransitions === true) || (function () {
        //     'use strict';
        //     var div = document.createElement('div').style;
        //     return ('transition' in div || 'WebkitTransition' in div || 'MozTransition' in div || 'msTransition' in div || 'MsTransition' in div || 'OTransition' in div);
        // })(),

        // classList: (function () {
        //     'use strict';
        //     var div = document.createElement('div').style;
        //     return 'classList' in div;
        // })()

    };

    // events names based on browser support
    PullToRefresh.events = (function () {

        if (PullToRefresh.support.touch) {
            return {
                start: PullToRefresh.namespace('touchstart'),
                move: PullToRefresh.namespace('touchmove'),
                end: PullToRefresh.namespace('touchend')
            }
        }

        var events = {
            start: PullToRefresh.namespace('mousedown'),
            move: PullToRefresh.namespace('mousemove'),
            end: PullToRefresh.namespace('mouseup')
        };

        if (!!(window.navigator.msPointerEnabled)) {
            events = {
                start: PullToRefresh.namespace('MSPointerDown'),
                move: PullToRefresh.namespace('MSPointerMove'),
                end: PullToRefresh.namespace('MSPointerUp')
            };
        }

        if (!!(window.navigator.pointerEnabled)) {
            events = {
                start: PullToRefresh.namespace('pointerdown'),
                move: PullToRefresh.namespace('pointermove'),
                end: PullToRefresh.namespace('pointerup')
            };
        }

        return events;

    })();


    /**
     * Construct method to bind all events to respectives elements
     * @method
     */
    PullToRefresh.prototype.construct = function _pulltorefresh__construct() {
        var self = this;
        self.$element
            .on(PullToRefresh.events.start, self.proxy(self.onTouchStart, self))
            .on(PullToRefresh.events.move, self.proxy(self.onTouchMove, self))
            .on(PullToRefresh.events.end, self.proxy(self.onTouchEnd, self));

        if (self.options.simulateTouch) {
            self.$element
                .on(PullToRefresh.namespace('mousedown'), self.proxy(self.onTouchStart, self));
            $(document)
                .on(PullToRefresh.namespace('mousemove'), self.$element, self.proxy(self.onTouchMove, self))
                .on(PullToRefresh.namespace('mouseup'), self.$element, self.proxy(self.onTouchEnd, self));
        }
    };

    /**
     * Destroy method to remove all event listeners of element
     * @method
     */
    PullToRefresh.prototype.destroy = function _pulltorefresh__destroy() {

        this.$element
            .off(PullToRefresh.namespace(''))
        $(document)
            .off(PullToRefresh.namespace(''))

    };


    // proxy function to trigger funcions with correct "this"
    PullToRefresh.prototype.proxy = (function () {

        var has_bind = !!(Function.prototype.bind);

        // if browser supports bind, use it (why reinvent the wheel?)
        if (has_bind) {
            return function _pulltorefresh__bind(fn, context) {
                return fn.bind(context);
            }
        } else {
            // if lib has proxy
            if ($.proxy) {
                return $.proxy;
            } else {
                // else create it
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

    /**
     * Method to transform the Element in pixels
     * @param  {CSSProperties} style .style of Element
     * @param  {int} value value of tranformation
     * @method
     */
    PullToRefresh.prototype.transform = function _pulltorefresh__transform(style, value) {

        style.webkitTransform = 'translate(0, ' + value + 'px) ' + 'translateZ(0)';
        style.msTransform =
            style.MsTransform =
            style.MozTransform =
            style.OTransform =
            style.transform = 'translateY(' + value + 'px)';
    };


    /**
     * Method to set a transition on Element
     * @param  {CSSProperies} style .style of Element
     * @param  {string} ms    css value to duration of transition
     * @method
     */
    PullToRefresh.prototype.transition = function PullToRefresh__transition(style, ms) {
        style.webkitTransitionDuration =
            style.MozTransitionDuration =
            style.msTransitionDuration =
            style.OTransitionDuration =
            style.transitionDuration = ms;
    };


    /**
     * Method to get x and y axis from event
     * @param  {MouseEvent|TouchEvent}  event        Event by mousedown or touchstart
     * @param  {Boolean} isTouchEvent flag to indicate a touch event
     * @return {object}               Object with x and y values like "{x: 1, y: 1}"
     * @method
     */
    PullToRefresh.prototype.getAxis = function _pulltorefresh__getAxis(event, isTouchEvent) {
        return {
            x: isTouchEvent ? (event.targetTouches || event.originalEvent.targetTouches)[0].pageX : (event.pageX || event.clientX),
            y: isTouchEvent ? (event.targetTouches || event.originalEvent.targetTouches)[0].pageY : (event.pageY || event.clientY)
        }

    }

    /**
     * method to listen event start
     * @param  {MouseEvent|TouchEvent} event Original event fired by DOM
     * @method
     */
    PullToRefresh.prototype.onTouchStart = function _pulltorefresh__ontouchstart(event) {
        var isTouchEvent = event.type === 'touchstart',
            axis = this.getAxis(event, isTouchEvent);

        // if not left click, cancel
        if (!isTouchEvent && event.which !== 1) {
            return;
        }

        this.flags.touched = true;
        this.flags.refreshed = false;
        this.flags.isTouch = isTouchEvent;

        this.positions.startY = axis.y;
        this.positions.startX = axis.x;

        this.$element.trigger(PullToRefresh.namespace('start'), [axis.y])

        this.transition(this.$element[0].style, "0ms");

        event.stopPropagation();
        event.preventDefault();
    };

    /**
     * Method to listen the movement of element
     * @param  {MouseEvent|TouchEvent} event Original move event fired by DOM
     * @method
     */
    PullToRefresh.prototype.onTouchMove = function _pulltorefresh__ontouchmove(event) {

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

        // reset on horizontal scroll threshold fail
        if (Math.abs(axis.x - this.positions.startX) > this.options.threshold) {
            this.reset();
            return;
        }

        // not move with negative
        if (delta < 0) return;



        // fires the refresh event if necessary and not has been triggered before
        if (delta >= this.options.refresh && !this.flags.refreshed) {

            // fire refresh event
            this.$element.trigger(PullToRefresh.namespace('refresh'), [axis.y]);

            // set flag to not trigger this event until next touchend
            this.flags.refreshed = true;

            // if configured to reset on refresh, do it
            if (this.options.resetRefresh) {
                this.reset();
                return;
            }

        }

        if (this.flags.refreshed && this.options.lockRefresh) {
            return;
        }

        // current step, necessary to define if call move event
        step = parseInt(delta / this.options.sensibility, 10);

        // if is a next step, fire event and inform the perncentage of pull
        if (this.positions.lastStep != step) {
            percentage = parseInt((delta * 100) / this.options.refresh, 10);
            this.$element.trigger(PullToRefresh.namespace('move'), percentage);
            this.positions.lastStep = step;
        }
        // finally tranform element to current touch position
        this.transform(this.$element[0].style, delta);

        event.stopPropagation();
        event.preventDefault();
    };

    /**
     * Method to listen the end of user action
     * @method
     */
    PullToRefresh.prototype.reset = function _pulltorefresh__reset() {
        this.transition(this.$element[0].style, this.options.resetSpeed);
        this.transform(this.$element[0].style, 0);
        this.flags.touched = false;
        this.flags.isTouch = false;
        this.flags.refreshed = false;
        this.positions.startY = false;
    };

    /**
     * Method to listen the end of touch event
     * @param  {MouseEvent|TouchEvent} event Original end event fired by DOM
     * @method
     */
    PullToRefresh.prototype.onTouchEnd = function PullToRefresh__onTouchEnd(event) {
        if (!this.flags.touched) {
            return;
        }

        this.positions.startY = 0;
        this.positions.startX = 0;

        this.reset();

        this.$element.trigger(PullToRefresh.namespace('end'));

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

            if (!data && option == 'destroy') return

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

    // TODO create this V
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