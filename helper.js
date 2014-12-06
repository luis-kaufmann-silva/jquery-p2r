/**
 * @module  PullToRefresh_helper
 *
 */
+(function _helper__module(window) {
    if (window.jQuery || window.Zepto) {
        return;
    }

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

    window.DomHelper = function _helper(sel) {
        return new Helper(sel);
    };

})(window);