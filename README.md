[![GitHub version](https://badge.fury.io/gh/luis-kaufmann-silva%2Fjquery-p2r.png)](http://badge.fury.io/gh/luis-kaufmann-silva%2Fjquery-p2r)

##Download
---

jQuery Pull to Refresh is available to be downloaded from bower or github


<div class='row' markdown='1'>
    <div class='col-md-4 col-sm-12'>
        <h3>
            Bower
        </h3>
        <p>
            <pre><code class='lang-shell'>$ bower install --save pulltorefresh</code></pre>
        </p>
        
    </div>
    <div class='col-md-4 col-sm-6'>
        <h3>
            Compacted
        </h3>
        <p>
            <a href='https://github.com/luis-kaufmann-silva/jquery-p2r/archive/master.zip' class='btn btn-default btn-outline btn-lg btn-block'>
                jquery-p2r.zip
            </a>
        </p>
        
    </div>
    <div class='col-md-4 col-sm-6'>
        <h3>
            Source code
        </h3>
        <p>
            <a href='https://github.com/luis-kaufmann-silva/jquery-p2r' class='btn btn-default btn-outline btn-lg btn-block'>
                Github page
            </a>
        </p>
        
    </div>

</div>

##Instalation##
---
After download it, add after jQuery

```html
<!-- jQuery Pull to Refresh plugin -->
<script src='path/to/jquery-p2r.min.js' type='text/javascript' defer></script>
```

##Simple example##
---

A simple way to implement pull to refresh plugin

```js
$(document).ready(function (){
    $("selector").pullToRefresh();
})
```


#Events
---

## Start 

Fires when the user touch or click the element (see [simulateTouch][1])

**Example:**

```js
.on("start.pulltorefresh", function (evt, y){})
```


**Parameters:**
-   `evt` Original event (mousedown or touchstart)
-   `y` Position of element on Y axis

---

## Move

Fires when the user move the element (see [sensibility][2])

**Example:**

```js
.on("move.pulltorefresh", function (evt, percent){})
```


**Parameters:**
-   `evt` Original event (mousemove or touchmove)
-   `percent` Percentage of pull moviment based on option [refresh][3]

---

## End

Fires when the touch event stop

**Example:**

```js
.on("end.pulltorefresh", function (evt){})
```


**Parameters:**
-   `evt` Original event (mouseup or touchend)

---


## Refresh

Fires when the touch distance variation of the initial point to the end point is greater or equal to [refresh][3]

**Example:**

```js
.on("refresh.pulltorefresh", function ($element, y){})
```


**Parameters:**
-   `$element` jQuery element
-   `y` Position of element on Y axis

---


##Examples of events

All examples are hosted on codepen.io under tag <a href='http://codepen.io/tag/jquery-p2r/' target="_blank">jquery-p2r</a>

<div data-trigger='codepen' data-autostart='true' data-hash="AkyLH"></div>



  [1]: /options/#simulateTouch
  [2]: /options/#sensibility
  [3]: /options/#refresh



##Options
---

You can configure some properties to better adapt the plugin to your needs

<div id='sensibility'>
    <h3 class='show-link-hover'>
        <code>sensibility</code>
    </h3>
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

<div id='resetSpeed'>
    <h3>
        <code>resetSpeed</code>
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
