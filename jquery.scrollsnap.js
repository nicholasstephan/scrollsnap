/**
jQuery.scrollsnap.js
**/

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function ($) {
	"use strict";

	/* Throttle a function. Taken from underscorejs. Changed 
	params to take time as Frames Per Second as first arg 
	rather than time in milliseconds. */

	var throttle = function(fps, func) {
		var context, args, timeout, result;
		var previous = 0;
		var later = function() {
			previous = new Date;
			timeout = null;
			result = func.apply(context, args);
		};

		return function() {
			var now = new Date;
			var remaining = (1000/fps) - (now - previous);
			
			context = this;
			args = arguments;
			
			if (remaining <= 0) {
				clearTimeout(timeout);
				timeout = null;
				previous = now;
				result = func.apply(context, args);
			} else if (!timeout) {
				timeout = setTimeout(later, remaining);
			}

			return result;
		};
	};

	/* Custom easing functions. Lifted from jQuery easing plugin
	http://gsgd.co.uk/sandbox/jquery/easing/ */

	$.extend($.easing, {
		snapBounce: function (x, t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},
		snapElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		}
	});


	/* DEFINITION */

	var ScrollSnap = function(el, options) {
		// Element
		this.$el = $(el);

		// Options
		this.options = options;

		// Start watching events.
		this.start();
	};

	ScrollSnap.prototype = {

		start: function() {
			this.$el.on('scroll.scrollsnap', throttle(this.options.latency, $.proxy(this, '_onScroll')));
		},

		stop: function() {
			clearTimeout(this.timeout);
			this.$el.off('scroll.scrollsnap');
		},

		_snap: function() {
			// Get the closest element.
			var $snapTo = this._closestElement();

			// Calc position.
			var props = {
				scrollTop: this.$el.scrollTop() + $snapTo.position().top,
				scrollLeft: this.$el.scrollLeft() + $snapTo.position().left
			};

			// Animate.
			this.$el.animate(props, 400, 'snapElastic');
		},

		_onScroll: function() {
			// Stop any existing animation.
			this.$el.stop();

			// Debounced snapping.
			clearTimeout(this.timeout);
			this.timeout = setTimeout($.proxy(this, '_snap'), this.options.latency+10);
		},

		_closestElement: function() {
			var $snapTo, dist;
			this.$el.find(this.options.snapTo).each(function() {
				var $this = $(this);
				var a = $this.position().top;
				var b = $this.position().left;
				var d = Math.sqrt(a*a + b*b);
				if(dist == undefined || d<dist) {
					dist = d;
					$snapTo = $this;
				}
			});
			return $snapTo;
		},
	};


	/* jQuery PLUGIN */
	
	$.fn.scrollSnap = function (option) {
		return this.each(function () {
			var $this = $(this), 
				data = $this.data('scrollsnap'),
				options = $.extend({}, $.fn.scrollSnap.defaults, typeof option == 'object' && option);

			if(!data) 
				$this.data('scrollsnap', (data = new ScrollSnap(this, options)));

			if(typeof option == 'string') 
				data[option]();
			
		});
	};

	$.fn.scrollSnap.defaults = {
		latency: 35,
		snapTo: ">*"
	};

	$.fn.scrollSnap.Constructor = ScrollSnap;
}));