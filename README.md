jQuery - Pull to Refresh
==========

Docs under contruction, if you want it now, please <a target="_blank" href="mailto:luis.kauffmann.silva@gmail.com?subject=GitHub%20-%20P2R%20Docs">send me an email</a> 
---

Options:

```javascript

default = {
  sensibility: 10, // number of pixels to each call of "move" event
  refresh: 100, // value in pixels to fire "refresh" event
  lockRefresh: false, // indicates that the user can pull up to get the value "refresh"
  resetRefresh: false, // indicates that the "reset" function will be called immediately when occur the event "refresh"
  autoInit: true, // indicates that the "PullToRefresh" object must be built on startup "plugin"
  resetVelocity: "100ms", // speed of reset animation in milliseconds
  simulateTouch: true, // simulate touch events with mouse events
  tolerance: 10 // integer with the threshold variation of the y axis
}
```

Events:

`start.pulltorefresh`: Start of touch
`move.pulltorefresh`:  Touch move (see sensibility)
`end.pulltorefresh`: End of touch

`refresh.pulltorefresh`: when the value 'refresh' is reached

