scrollsnap
==========

Snaps to elements when scrolling their container. 


## Basic usage. 

Snap to any direct child of the container.
	
	$(container).scrollSnap();


## Options

* **snapTo** _(Selector, default: ">*")_
A selector specifying which child elements should be snapped. Defaults to all direct children.


## AMD

Works with AMD loaders, expecting 'jQuery' named module using: 

	(function (factory) {
		if (typeof define === 'function' && define.amd) {
			define(['jquery'], factory);
		} else {
			factory(jQuery);
		}
	}(function ($) {
		...
	});