$.fn.animCustombar = function () {
    $(this).each(function () {
        console.log('init')
        var $this = $(this);
        var target = $this.find(' > .custom-scroll-body');
        var scroller = $this.find(' > #scroller');
        var scrollerheight = scroller.outerHeight();
        // var scrollbody = $('#custom-scroll-body');
        var scrolbodyheight = target.outerHeight();
        var mousedown = 'mousedown touchstart';
        var mouseup = 'mouseup touchend';
        var mousemove = 'mousemove touchmove';
        var scrollWrapper = $this.find('#scroller-wrapper');
        var touch = false;
        var diff, scrollarea;
        var raf = window.mozRequestAnimationFrame ||
                          window.webkitRequestAnimationFrame ||
                          window.msRequestAnimationFrame ||
                          window.oRequestAnimationFrame;
        var animLoop = function (render, element) {
            var running, lastFrame = +new Date;
            function loop(now) {
                if (running !== false) {
                    raf ?
                      raf(loop, element) :
                    // fallback to setTimeout
                      setTimeout(loop, 16);
                    // Make sure to use a valid time, since:
                    // - Chrome 10 doesn't return it at all
                    // - setTimeout returns the actual timeout
                    now = now && now > 1E4 ? now : +new Date;
                    var deltaT = now - lastFrame;
                    // do not render frame when deltaT is too high
                    if (deltaT < 160) {
                        running = render(deltaT, now);
                    }
                    lastFrame = now;
                }
            }
            loop();
        };
        var scrollNow = $this.scrollTop();
        var scrollThen;
        var dimnow = { 'width': target.width(), 'height': target.height() };
        var dimthen = { 'width': null, 'heigh': null };
        var totalHeight = function (element) {
            var height = 0;
            element.find(' > *').each(function () {
                height = height +  $(this).outerHeight();
            });
            return height;
        }
     
        var counter = 0 
        animLoop(function () {
            scrollarea = target.height() - scrollerheight;
            scrollNow = target.scrollTop();
            dimnow = { 'width': $this.width(), 'height': $this.height() };
            if (scrollNow !== scrollThen) {
                scrollThen = scrollNow;
                scrollerheight = (target.outerHeight() / totalHeight(target)) * target.outerHeight();
                diff = totalHeight(target) - target.height();
                if (diff > 0) {
                    scrollarea = target.height() - scrollerheight;
                    var scrollpost = (scrollarea / diff) * scrollNow;
                    scroller.css({ 'top': scrollpost, 'height': scrollerheight, 'display': 'block' });
                }
                else {
                    console.log(counter)
                    if (counter !== 0) {
                        scroller.hide();
                    }
                    //scroller.hide();
                }
                
            }
            if (dimnow.width !== dimthen.width || dimnow.height !== dimthen.height) {
                dimthen = dimnow;
                scrollerheight = (target.outerHeight() / totalHeight(target)) * target.outerHeight();
                diff = totalHeight(target) - target.height();
                scrollarea = target.height() - scrollerheight;
                if (diff > 0) {
                    scroller.css({ 'height': scrollerheight, 'display': 'block' });
                }
                else {
                    console.log(counter)
                    if (counter !== 0) {
                        scroller.hide();
                    }
                    //scroller.hide();
                }
               
            }
            counter++;
        });
        var startypost = 0;
        var ymove = 0;
        var startscroll = 0;
        scroller.bind(mousedown, function (e) {
            touch = true;
            startypost = scroller.position().top;
            ymove = e.pageY;
            console.log(ymove);
            startscroll = target.scrollTop();
            scroller.removeClass('animate');
            target.addClass('custom-scroll-noselect');
            scrollWrapper.addClass('custom-scroll-noselect');
        });
        $(window).bind(mousemove, function (e) {
            if (touch) {
                scrollerheight = (target.outerHeight() / totalHeight(target)) * target.outerHeight();
                scrollarea = target.height() - scrollerheight;
                diff = totalHeight(target) - target.height();
                var movement = ymove - e.pageY;
                var scroll = startscroll - movement;
                var scrollpost = (scrollarea / diff);
                var top = Math.min(Math.max(startypost - movement, 0), scrollarea);
                console.log(top / scrollpost)
                target.scrollTop((top / scrollpost));
                
            }
        });
        $(window).bind(mouseup, function () {
            touch = false;
            target.removeClass('custom-scroll-noselect');
            scrollWrapper.addClass('custom-scroll-noselect');
            scroller.addClass('animate');
        })
        target.bind('mouseleave.customscroll', function () {
            touch = false;
        })
        scrollWrapper.click(function (e) {
            var post = e.pageY - target.offset().top;
            var scrollpost = (scrollarea / diff);
            var top = Math.min(Math.max(post, 0), scrollarea);
            console.log(post)
            target.scrollTop((top / scrollpost));
        });

    })
    return false;
}