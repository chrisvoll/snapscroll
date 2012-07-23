Snap Scroll
==========

A jQuery plugin for smooth horizontal snappable scrolling on mobile devices.

This attempts to duplicate the functionality of the iPhone App Store's horizontal-scrolling elements for use on all mobile platforms. Here's some of the things it can do:

- Snap to scroll: Scroll a little bit, and it snaps to the next page
- Multitouch: Move multiple scroll elements at once
- Elastic scrolling: Scroll past the last page, and it snaps back—just like native scrolling


## Dependencies

The only thing you really need is jQuery. This includes the animation easing functions from jQuery UI, but if you're already using that, you can remove them from snapScroll.js.

## Usage

``` javascript
$(object).snapScroll({ options });
```

## Options

- **width:** width of each page. If this is less than the window width, part of the next page will show (px)
- **space:** amount of space between the page width and window width (px)

*(note: width + space should equal the window width)*

- **steps:** number of pages you want scrolled to
- **speed:** speed of the snapping animation (ms)
- **buffer:** escape buffer. e.g., if this is 20, the user has to move the element 20px before it will snap to the next page, or will snap back to where it was
- **easing:** easing function. SnapScroll includes the basic easeOut animations from jQuery UI since those are the smoothest to use for this, but you can include jQuery UI if you want the others
- **flush:** ensure that the scrollable element always remains flush with the edge of the window. If this is enabled, scrolling to the end will show part of the previous page on the left

## Bugs

Working with scrolling across different mobile platforms can be a frustrating experience, so there are still a few kinks that need to be worked out. The most obvious issue is that scrolling the page causes the elements to jump around. I temporarily fixed this by resetting the original position after `scroll` is fired by the window, but there's still a short amount of time where the broken version is shown.

The code is also pretty messy right now, so I'm confident that there are ways to clean it up and optimize it.

## License

&copy; Copyright 2012 Chris Voll under a dual MIT/GPL license.