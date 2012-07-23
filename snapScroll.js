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

      // Number of pages you have in the element
      pageCount: 6,

      // Extra space at the edge of the page. Should be window.width - step.width
      pageSpace: 35,

      // Speed of the snapping animation
      speed: 300,

      // Escape buffer. e.g., move 20px before moving to the next page
      buffer: 20,

      // Easing. Check the functions included below, or use the ones from jQuery UI.
      easing: 'easeOutCubic',

      // Keep the pages flush with the edge of the window when you scroll to the last page
      flush: true

    }, (arguments[0] || {}));

    this.each(function() {
      var $this = $(this),
          currentSnap = 0, // the last snap point
          currentpx   = 0, // actual location
          animating, // Set to false to interrupt the animation
          touchPos,  // x pos of finger
          scrollPos, // x pos of scroll element
          currentTouch, // event touch object. persistent on iOS, breaks on Android
          isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1,


          /* Get the position to snap to
          ************************************************/
          snapPos = function() {
            // Determine what it's closest to
            var offset = $this.offset().left,
                left = Math.abs(offset); // snap if greater than buffer

            // Snap back if we're within the buffer or past the beginning
            var reset = Math.abs(left - currentSnap) < options.buffer || offset > 0;

            return reset
                   ? currentSnap // reset
                   : left >= currentSnap + options.buffer
                           ? currentSnap + options.pageWidth  // right
                           : currentSnap - options.pageWidth; // left
          },


          /* Move the scrollable element to a certain point
           *
           * Credit for the idea to use 3D transforms goes to:
           * http://untyped.com/untyping/2011/01/24/smooth-scrolling-for-mobile-safari/
           *
           * However, we can't use CSS3 animations because we can't gracefully degrade
           * them in older mobile browsers, and you can't interrupt them properly since
           * you can't get the current animation position (which is problematic because
           * of the easing).
          ****************************************************************************/
          scrollTo = function(pos, speed) {
            currentpx = pos;
            $this.css('-webkit-transform', 'translate3d(' + pos + 'px, 0, 0)');
          },


          /* Animate the scrolling
           *
           * translate3d can't be animated through jQuery, so animate the numbers
           * instead. Canceled by switching `animating` to false.
          ****************************************************************************/
          animateScrollTo = function(start, end) {
            animating = true;

            $({ n: start }).animate({ n: -end }, {
              step: function(n) {
                if (!animating) return false;
                scrollTo(n);
              },
              easing: options.easing,
              duration: options.speed
            });
          };

      // Initialize the translate3d which causes the element to flicker. Shouldn't
      // be a problem if we do it as the page loads
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
          currentSnap = snap;

          // Animate to the position
          animateScrollTo(currentpx, snap);
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
          animating = false;

          // If we move a certain distance, don't allow scrolling the window.
          // This isn't completely necessary, but makes the interaction feel more
          // solid. Otherwise, the hardware accelerated element can be scrolled at
          // the same time as the rest of the page on iOS.
          if (Math.abs(diff) > 10) return false;
        }
      });
    });
  };
})(jQuery);

/* Duplicate of the basic easeOut functions in jQuery UI. Feel
 * free to remove these if you have jQuery UI included.
 *************************************************************/
if (typeof jQuery.ui === 'undefined') {
  jQuery.extend(jQuery.easing, {
    easeOutQuad:  function (a, b, c, d, e) { return -d * (b /= e) * (b - 2) + c },
    easeOutCubic: function (a, b, c, d, e) { return  d * ((b = b / e - 1) * b * b + 1) + c },
    easeOutQuart: function (a, b, c, d, e) { return -d * ((b = b / e - 1) * b * b * b - 1) + c },
    easeOutQuint: function (a, b, c, d, e) { return  d * ((b = b / e - 1) * b * b * b * b + 1) + c },
    easeOutSine:  function (a, b, c, d, e) { return d * Math.sin(b / e * (Math.PI / 2)) + c },
    easeOutExpo:  function (a, b, c, d, e) { return b == e ? c + d : d * (-Math.pow(2, - 10 * b / e) + 1) + c },
    easeOutCirc:  function (a, b, c, d, e) { return d * Math.sqrt(1 - (b = b / e - 1) * b) + c },
    easeOutBack:  function (a, c, d, e, f, g) { return g == b && (g = 1.70158), e * ((c = c / f - 1) * c * ((g + 1) * c + g) + 1) + d }
  });
}