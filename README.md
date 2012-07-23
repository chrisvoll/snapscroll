Snap Scroll
==========

AjQuery plugin for smooth horizontal snappable scrolling on mobile devices


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

## License

&copy; Copyright 2012 Chris Voll under a dual MIT/GPL license.