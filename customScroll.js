$.fn.animCustombar = function () {
    $(this).each(function () {
        var $this = $(this);
        var target = $this.find('.custom-scroll-body');
        var scroller = $this.find('#scroller');
        var scrollerheight = scroller.outerHeight();
        // var scrollbody = $('#custom-scroll-body');
        var scrolbodyheight = target.outerHeight();
        var mousedown = 'mousedown touchstart MSPointerDown';
        var mouseup = 'mouseup touchend MSPointerMove';
        var mousemove = 'mousemove touchmove MSPointerUp';
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
        var targetpost = target.offset().top - target.parent().offset().top;
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
        var totalnoHeight = function (element) {
            var height = 0;
            element.find(' > *').each(function () {
                height = height +  $(this).outerHeight();
            });
            return height;
        }
        scroller.css('top', targetpost);
        var counter = 0;
        var scrollfirst = false;
        var targetheight = target.outerHeight() ;
        animLoop(function () {
            scrollarea = target.height() - scrollerheight;
            scrollNow = target.scrollTop();
            dimnow = { 'width': $this.width(), 'height': $this.height() };
            if (scrollNow !== scrollThen) {
                scrollThen = scrollNow;
                targetheight = target.outerHeight() ;
                scrollerheight = (targetheight / totalHeight(target)) * targetheight;
                diff = totalHeight(target) - target.height();
                if (diff > 0) {
                    scrollarea = target.height() - scrollerheight;
                    var scrollpost = ((scrollarea / diff) * scrollNow) + targetpost;
                    if (!touch) {
                         scroller.css({ 'top': scrollpost, 'height': scrollerheight, 'display': 'block' });
                    }
                    scrollfirst = true;
                    console.log(scrollNow)
                }
                else {
                    if (counter !== 0) {
                        scroller.hide();
                    }
                }
               
            }
            if (dimnow.width !== dimthen.width || dimnow.height !== dimthen.height) {
                dimthen = dimnow;
                targetheight = target.outerHeight() ;
                scrollerheight = (targetheight / totalHeight(target)) * targetheight;
                diff = totalHeight(target) - targetheight;
                scrollarea = targetheight - scrollerheight;
                if (diff > 0) {
                    scroller.css({ 'height': scrollerheight, 'display': 'block' });
                }
                else {
                    if (counter !== 0) {
                        scroller.hide();
                    }
                }
               
            }
            if (!scrollfirst) {
                scrollerheight = (target.outerHeight() / totalHeight(target)) * target.outerHeight();
                scroller.css({ 'height': scrollerheight });
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
                targetheight = target.outerHeight() ;
                scrollarea = targetheight - scrollerheight;
                diff = totalHeight(target) - targetheight;
                var movement = ymove - e.pageY;
                var scroll = startscroll - movement;
                var scrollpost = (scrollarea / diff);
                var scrollerpost = Math.min(Math.max(startypost - movement, 0),   targetheight - scrollerheight);
                var maxscroll = target[0].scrollHeight - $this[0].clientHeight;
                var top = scrollerpost * (maxscroll /scrollarea);
                scroller.css('top',  scrollerpost);
                target.scrollTop(top);
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