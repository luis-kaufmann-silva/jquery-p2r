jQuery - Pull to Refresh
==========

Docs under contruction, if you want now, please send-me a email 
---

Options:


`sensibility`: 10, // number of pixels to each call of "move" event
`refresh`: 100, // value in pixels to fire "refresh" event
`lockRefresh`: false, // indicates that the user can pull up to get the value "refresh"
`resetRefresh`: false, // indicates that the "reset" function will be called immediately when occur the event "refresh"
`autoInit`: true, // indicates that the "PullToRefresh" object must be built on startup "plugin"
`resetVelocity`: "100ms", // velocity of reset animation in milliseconds
`simulateTouch`: true, // simulate touch events with mouse events
`tolerance`: 10 // integer with the tolerance variation of the y axis


Events:

`start.pulltorefresh`: Start of touch
`move.pulltorefresh`:  Touch move (see sensibility)
`end.pulltorefresh`: End of touch

`refresh.pulltorefresh`: when the value 'refresh' is reached

