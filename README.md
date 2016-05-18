requestAnimationFrame Custom Scroll
=======================

Custom scroll using requestAnimationFrame.
Check out why this what is animframe and why should use it. 
[requestAnimationFrame](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/).



# Quick start

Put the javascript along with stylesheet. This plugin also jquery dependency.  

```html

 <link rel="stylesheet" href="customScroll.css">
 <div class="custom-scroll-wrapper full" data-scroll="custom">
    <div class="custom-scroll-body">
    /* 
      Put your content here.
    */
    </div>
    <div id="scroller-wrapper" class="scroller-wrapper"></div>
    <div id="scroller" class="scroller"></div>
</div>     

```
Since this javascript does not fire automatically, you need to fire it at your page.
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="customScroll.js"></script>
<script>
    $(document).ready(function () {
        $('[data-scroll="custom"]').animCustombar();
    })
</script>
```

You also need to adjust height of the content manually

```html
 <style>
        .custom-scroll-body {
            height: 400px;
            border: 1px solid #000;
        }
    </style>
```