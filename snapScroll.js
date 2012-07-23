/*
jQuery Snap Scroll Plugin
  * Version 1.0
  * 2012-07-22
  * URL: http://seatgeek.com
  * Description: jQuery plugin to duplicate horizontal scroll functionality in the iPhone App Store on mobile devices
  * Author: Chris Voll
  * Copyright: Copyright (c) 2012 Chris Voll under dual MIT/GPL license.
  * Usage:

    $(scrollable element).snapScroll(options);

  Scrollable element should have this CSS:

    width: number of pages * width of those pages;
    position: relative;
    left: 0;
    white-space: nowrap;

*/
(function ($) {
  $.fn.snapScroll = function() {

    /* Options
    ************************************************/
    var options = $.extend({

      // Snap width. Can (and should) be smaller than the window width, which will display
      // a part of the next page. Steps = the number of pages.
      pageWidth: $(window).width() - 35,
      pageCount: 6,

      // Extra space at the edge of the page. Should be window.width - step.width
      pageSpace: 35,

      // Speed of the snapping animation
      speed: 400,

      // Escape buffer. e.g., move 20px before moving to the next page
      buffer: 20,

      // Keep the pages flush with the edge of the window when you scroll to the last page
      flush: true

    }, (arguments[0] || {}));

    this.each(function() {
      var $this = $(this),
          current = 0,
          touchPos,  // x pos of finger
          scrollPos, // x pos of scroll element
          currentTouch,
          isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1,


          /* Get the position to snap to
          ************************************************/
          snapPos = function() {
            // Determine what it's closest to
            var offset = $this.offset().left,
                left = Math.abs(offset); // snap if greater than buffer

            // Determine where to snap to based on what direction the container was scrolled
            // in and where it was last.
            if (left >= current + options.buffer && (current / options.pageWidth) < (options.pageCount - 1) && offset < 0) {
              // Snap right
              return current + options.pageWidth;
            }
            else if (left <= current - options.buffer) {
              // Snap left
              return current - options.pageWidth;
            }
            else {
              // Return to original position
              return current;
            }
          },

          // Credit for the idea to use 3D transforms goes to
          // http://untyped.com/untyping/2011/01/24/smooth-scrolling-for-mobile-safari/
          scrollTo = function(pos, speed) {
            $this.css({
              '-webkit-transition': '-webkit-transform ' + speed + 'ms',
              '-webkit-transform': 'translate3d(' + pos + 'px, 0, 0)'
            });
          };

      scrollTo(0, 0);


      /* Event listeners for the scrollable element
      ************************************************/
      $this.on({

        // Scrolling started
        touchstart: function(e) {
          // Cache the touch so we can support true multitouch
          // Not supported on Android, which is addressed in touchmove
          currentTouch = e.originalEvent.touches[e.originalEvent.touches.length - 1];

          touchPos = currentTouch.pageX;
          scrollPos = $this.offset().left;
        },

        // Scrolling stopped, so snap to the right position
        'touchend touchcancel': function() {
          var snap = snapPos();

          // Make sure the left and right ends are flush with the window
          if (options.flush) {
            if (snap > options.pageWidth * (options.pageCount - 1) - options.pageSpace) snap = options.pageWidth * (options.pageCount - 1) - options.pageSpace;
            if (snap < 0) snap = 0;
          }

          // Animate to the position
          current = snap;
          scrollTo(snap * -1, options.speed);
        },

        // Drag movement
        touchmove: function(e) {

          // Android doesn't support multitouch, so we need to do this
          // so it doesn't break
          if (isAndroid) currentTouch = e.originalEvent.touches[0];

          var diff = currentTouch.pageX - touchPos,
              left = scrollPos + diff;

          // At the left or right end? Slow down the movement
          if (left > 0 || left < -(options.pageWidth * (options.pageCount - 1) - options.pageSpace)) left = scrollPos + diff / 3;

          scrollTo(left, 0);
        }
      });
    });
  };
})(jQuery);