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

    width: number of steps * width of those steps;
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
      width: $(window).width() - 35,
      steps: 6,

      // Extra space at the edge of the page. Should be window.width - step.width
      space: 35,

      // Speed of the snapping animation
      speed: 500,

      // Escape buffer. e.g., move 20px before moving to the next page
      buffer: 20,

      // Animation easing through jQuery (see below for included functions)
      easing: 'easeOutQuint',

      // Keep the pages flush with the edge of the window when you scroll to the last page.
      // If false, the left side will always be flush.
      flush: true

    }, (arguments[0] || {}));

    this.each(function() {
      var $this = $(this),
          current = 0,
          mousePos,  // x pos of mouse
          scrollPos, // x pos of scroll element
          savedPos,  // x pos of scroll element before page scroll
          currentTouch,
          isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1,


          /* Get the position to snap to
          ************************************************/
          snapPos = function() {
            // Determine what it's closest to
            var offset = $this.offset().left,
                left   = Math.abs(offset); // if greater than `buffer` in either direction, snap

            // Determine where to snap to based on what direction the container was scrolled
            // in and where it was last.
            if (left >= current + options.buffer && (current / options.width) < (options.steps - 1) && offset < 0) {
              // snap right if the position is beyond the right buffer and not at the end
              return current + options.width;
            }
            else if (left <= current - options.buffer) {
              // snap left
              return current - options.width;
            }
            else {
              // snap back, up on tha flo'
              return current;
            }
          };


      /* Event listeners for the scrollable element
      ************************************************/
      $this.on({

        // Scrolling started
        touchstart: function(e) {
          // Cache the touch so we can support true multitouch
          currentTouch = e.originalEvent.touches[e.originalEvent.touches.length - 1];

          $this.stop();
          mousePos = currentTouch.pageX;
          scrollPos = $this.offset().left;
        },

        // Scrolling stopped, so snap to the right position
        'touchend touchcancel': function() {
          var snap = snapPos();

          // Make sure the left and right ends are flush with the window
          if (options.flush) {
            if (snap > options.width * (options.steps - 1) - options.space) snap = options.width * (options.steps - 1) - options.space;
            if (snap < 0) snap = 0;
          }

          // Animate to the position
          setTimeout(function() {
            current = snap;
            $this.stop().animate({ left: snap * -1 + 'px' }, options.speed, options.easing);
          }, 0);
        },

        // Drag movement
        touchmove: function(e) {

          // Android doesn't support multitouch, so we need to do this
          // so it doesn't break
          if (isAndroid) {
            currentTouch = e.originalEvent.touches[0];
          }
          var diff = currentTouch.pageX - mousePos,
              left = scrollPos + diff;

          // At the left or right end? Slow down the movement
          if (left > 0 || left < -(options.width * (options.steps - 1) - options.space)) left = Math.round(scrollPos + diff / 3);
          $this.css('left', left + 'px');

          // Don't allow the page to scroll if we've moved the scrollable element a certain distance.
          // The heigher this number is, the easier it is to scroll vertically (though harder horizontally).
          if (Math.abs(diff) > 10) { return false; }
        }
      });


      /* Fix for issue where the position jumps after a scroll:
       * Save the x position on each touchstart so we can return to it if a scroll is fired.
       *
       * TODO: Find a way to make this suck less, because `scroll` isn't fired into long after
       *       it screws up the position.
       ************************************************/
      $(window).on({
        touchstart: function() { savedPos = $this.css('left'); },
        scroll:     function() { $this.css('left', savedPos);  }
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