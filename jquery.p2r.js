/**
 * @module PullToRefresh
 *
 */
+(function _pulltorefresh__module($) {
    'use strict';

    /**
     * Interface to make common stufs
     * @class Helper
     * @param {Element} sel Element to posterior manipulation
     * @example
     * var h = new Helper(document);
     *
     */
    var Helper = function (sel) {
        // save the original element
        this.$el = sel;
    }

    /**
     * Remove listeners from $el
     * @method
     * @param  {string} event   Event name
     * @param  {function} handler Original callback
     * @return {object} charing object
     */
    Helper.prototype.off = function _off(event, handler) {
        // remove namespace
        (~event.indexOf('.')) && (event = event.split('.')[0]);

        this.$el.removeEventListener(event, handler, true);

        return this;
    }


    Helper.prototype.on = function _on(event, handler) {
        // remove namespace
        (~event.indexOf('.')) && (event = event.split('.')[0]);

        this.$el.addEventListener(event, handler, true);

        return this;
    }

    Helper.prototype.trigger = function _trigger(event, extra) {

        var e = ('Event' in window && new Event(event)) || document.createEvent(event);

        window.dispatchEvent(e);

        return this;
    }

    //if ('jQuery' in window) {
    $ = function _helper(sel) {
        return new Helper(sel);
    };
    //}


    /**
     * Definition of class PullToRefresh
     * @class PullToRefresh
     * @param {Element} element Element that the action of "pull to refresh" will be executed
     * @param {object} options Object with the custom configuration
     * @example
     * var el = document.getElementById('div1');
     * var x = new PullToRefresh(el)
     * var x = new PullToRefresh(el, { refresh: 10 })
     */
    var PullToRefresh = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = {
            sensibility: 1, // number of pixels to each call of "move" event
            refresh: 200, // value in pixels to fire "refresh" event
            lockRefresh: false, // indicates that the user can pull up to get the value "refresh"
            resetRefresh: false, // indicates that the "reset" function will be called immediately when occur the event "refresh"
            autoInit: true, // indicates that the "PullToRefresh" object must be built on startup "plugin"
            resetSpeed: "100ms", // speed of reset animation in milliseconds
            simulateTouch: true, // simulate touch events with mouse events
            threshold: 20 // integer with the threshold variation of the y axis
        };

        //self.DEFAULTS; //$.extend({}, self.DEFAULTS, options);
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


    // key to namespace events
    PullToRefresh.key = 'pulltorefresh';

    // preferences
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

    var Detector = {}

    Detector.support = {
        touch: (window.Modernizr && Modernizr.touch === true) || (function () {
            'use strict';
            return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
        })(),
    };

    Detector.events = (function () {

        if (Detector.support.touch) {
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



    // support detection on touch events
    // PullToRefresh.support = {

    //     touch: (window.Modernizr && Modernizr.touch === true) || (function () {
    //         'use strict';
    //         return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    //     })(),

    // };

    // // events names based on browser support
    // PullToRefresh.events = (function () {

    //     if (PullToRefresh.support.touch) {
    //         return {
    //             start: PullToRefresh.namespace('touchstart'),
    //             move: PullToRefresh.namespace('touchmove'),
    //             end: PullToRefresh.namespace('touchend')
    //         }
    //     }

    //     var events = {
    //         start: PullToRefresh.namespace('mousedown'),
    //         move: PullToRefresh.namespace('mousemove'),
    //         end: PullToRefresh.namespace('mouseup')
    //     };

    //     if (!!(window.navigator.msPointerEnabled)) {
    //         events = {
    //             start: PullToRefresh.namespace('MSPointerDown'),
    //             move: PullToRefresh.namespace('MSPointerMove'),
    //             end: PullToRefresh.namespace('MSPointerUp')
    //         };
    //     }

    //     if (!!(window.navigator.pointerEnabled)) {
    //         events = {
    //             start: PullToRefresh.namespace('pointerdown'),
    //             move: PullToRefresh.namespace('pointermove'),
    //             end: PullToRefresh.namespace('pointerup')
    //         };
    //     }

    //     return events;

    // })();


    /**
     * Construct method to bind all events to respectives elements
     * @method
     * @version 2.0.1
     * @since 2.0.1
     * @method construct
     */
    PullToRefresh.prototype.construct = function _pulltorefresh__construct() {
        var self = this;
        self.$element
            .on(PullToRefresh.namespace(Detector.events.start), self.onTouchStart.bind(self))
            .on(PullToRefresh.namespace(Detector.events.move), self.onTouchMove.bind(self))
            .on(PullToRefresh.namespace(Detector.events.end), self.onTouchEnd.bind(self));

        if (self.options.simulateTouch) {
            self.$element
                .on(PullToRefresh.namespace('mousedown'), self.onTouchStart.bind(self))
            $(document)
                .on(PullToRefresh.namespace('mousemove'), self.onTouchMove.bind(self))
                .on(PullToRefresh.namespace('mouseup'), self.onTouchEnd.bind(self));
        }
    };

    /**
     * Destroy method to remove all event listeners of element
     * @method
     */
    PullToRefresh.prototype.destroy = function _pulltorefresh__destroy() {

        var self = this;

        self.$element
            .off(PullToRefresh.namespace(Detector.events.start), self.onTouchStart.bind(self))
            .off(PullToRefresh.namespace(Detector.events.move), self.onTouchMove.bind(self))
            .off(PullToRefresh.namespace(Detector.events.end), self.onTouchEnd.bind(self));

        if (self.options.simulateTouch) {
            self.$element
                .off(PullToRefresh.namespace('mousedown'), self.onTouchStart.bind(self))
                .off(PullToRefresh.namespace('mousemove'), self.onTouchMove.bind(self))
                .off(PullToRefresh.namespace('mouseup'), self.onTouchEnd.bind(self));
        }

    };


    /**
     * Method to transform the Element in pixels
     * @param  {CSSProperties} style .style of Element
     * @param  {int} value value of tranformation
     * @method
     */
    PullToRefresh.prototype.transform = function _pulltorefresh__transform(style, value) {
        //return false;
        style.webkitTransform = 'translate(0px, ' + value + 'px) ' + 'translateZ(0px)';
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
     * Method to listen event start
     * @param  {MouseEvent|TouchEvent} event Original event fired by DOM
     * @method
     */
    PullToRefresh.prototype.onTouchStart = function _pulltorefresh__ontouchstart(event) {
        var isTouchEvent = event.type === 'touchstart',
            axis = this.getAxis(event, isTouchEvent);

        // if not left click, cancel
        if (!isTouchEvent && event.which !== 1 || this.flags.touched) {
            return;
        }

        this.flags.touched = true;
        this.flags.refreshed = false;
        this.flags.isTouch = isTouchEvent;

        this.positions.startY = axis.y;
        this.positions.startX = axis.x;

        this.$element.trigger(PullToRefresh.namespace('start'), [axis.y])

        this.transition(this.element.style, "0ms");

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
        //console.log(Math.abs(axis.x - this.positions.startX))
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
        this.transform(this.element.style, delta);

        event.stopPropagation();
        event.preventDefault();
    };

    /**
     * Method to listen the end of user action
     * @method
     */
    PullToRefresh.prototype.reset = function _pulltorefresh__reset() {
        this.transition(this.element.style, this.options.resetSpeed);
        this.transform(this.element.style, 0);
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

    window.PullToRefresh = PullToRefresh;

})(window.jQuery || window.Zepto);