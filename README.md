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

- `start.pulltorefresh`: Start of touch
- `move.pulltorefresh`:  Touch move (see sensibility)
- `end.pulltorefresh`: End of touch
- `refresh.pulltorefresh`: when the value 'refresh' is reached


##Options
---

You can configure some properties to better adapt the plugin to your needs

<div id='sensibility'>
    <div class='page-header'>
        <h3 class='show-link-hover'>
            <code>sensibility</code>
            
            <small>
                <a href='#sensibility'>link</a>
            </small>
        
        </h3>
    </div>
    <p>
        Number of pixels to each call of "move" event
    </p>
    
    <strong>default</strong>: <code>10</code>

    <div data-trigger='codepen' data-hash='cIjfy'></div>

</div>

<div id='refresh'>
    <h3>
        <code>refresh</code>
    </h3>
    <p>
        Value in pixels to fire "refresh" event
    </p>

    <strong>default</strong>: <code>200</code>
    
    <div data-trigger='codepen' data-hash='dGcfL'></div>

</div>

<div id='lockRefresh'>
    <h3>
        <code>lockRefresh</code>
    </h3>

    <p>
        Indicates that the user can pull up to get the value "refresh"
    </p>

    <strong>default</strong>: <code>false</code>
    
    <div data-trigger='codepen' data-hash='cpDJL'></div>

</div>

<div id='resetRefresh'>
    <h3>
        <code>resetRefresh</code>
    </h3>

    <p>
        Indicates that the "reset" function will be called immediately when occur the event "refresh"
    </p>

    <strong>default</strong>: <code>false</code>
    
    <div data-trigger='codepen' data-hash='hjAgz'></div>

</div>

<div id='autoInit'>
    <h3>
        <code>autoInit</code>
    </h3>

    <p>
        Indicates that the "PullToRefresh" object must be built on startup "plugin"
    </p>

    <strong>default</strong>: <code>true</code>

    <div data-trigger='codepen' data-hash='kzlqg'></div>

</div>

<div id='resetVelocity'>
    <h3>
        <code>resetVelocity</code>
    </h3>

    <p>
        Speed of reset animation in milliseconds
    </p>

    <strong>default</strong>: <code>100ms</code>

    <div data-trigger='codepen' data-hash='DHmIt'></div>

</div>

<div id='simulateTouch'>
    <h3>
        <code>simulateTouch</code>
    </h3>

    <p>
        Simulate touch events with mouse events
    </p>

    <strong>default</strong>: <code>true</code>

    <div data-trigger='codepen' data-hash='kKIrz'></div>

</div>

<div id='threshold'>
    <h3>
        <code>threshold</code>
    </h3>

    <p>
        Integer with the threshold variation of the y axis
    </p>

    <strong>default</strong>: <code>20</code>

    <div data-trigger='codepen' data-hash='olkhw'></div>

</div>



