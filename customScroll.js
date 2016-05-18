$.fn.animCustombar = function (options) {
 
    $(this).each(function () {
        var options = options || {};
        var defaults = { topoffset: 0 };
        var $this = $(this);
        var settings = $.extend({}, defaults, options);
        var target = $this.find('.custom-scroll-body');
        var scroller = $this.find('#scroller');
        var scrollerheight = scroller.outerHeight();
        // var scrollbody = $('#custom-scroll-body');
        var scrolbodyheight = target.outerHeight();
        var mousedown = 'mousedown.customscroll touchstart.customscroll MSPointerDown.customscroll';
        var mouseup = 'mouseup.customscroll touchend.customscroll MSPointerMove.customscroll';
        var mousemove = 'mousemove.customscroll touchmove.customscroll MSPointerUp.customscroll';
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
                   // console.log(deltaT)
                    // if (deltaT < 160) {
                    if ((deltaT < 17) && (deltaT > 0)) {
                        //console.log(deltaT)
                        running = render(deltaT, now);
                    }
                    lastFrame = now;
                }
            }
            loop();
        };
        var scrollNow = $this.scrollTop();
        var targetpost = target.offset().top - $this.offset().top;
        var topoffset = targetpost + settings.topoffset;
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
        var targetheight = target.outerHeight();
        var scrollareatolerance = 100;
        animLoop(function () {
            scrollarea = target.height() - scrollerheight;
            scrollNow = target.scrollTop();
            dimnow = { 'width': $this.width(), 'height': $this.height() };
            if (scrollNow !== scrollThen) {
                scrollThen = scrollNow;
                targetheight = target.outerHeight();
                var sumHeight = totalHeight(target);
                scrollerheight = (targetheight / sumHeight) * targetheight;
                diff = sumHeight - target.height();
                if (diff > 0) {
                    scrollarea = target.height() - scrollerheight;
                    var scrollpost = ((scrollarea / diff) * scrollNow) + targetpost;
                    if (!touch) {
                         scroller.css({ 'top': scrollpost, 'height': scrollerheight, 'display': 'block' });
                    }
                    scrollfirst = true;
                }
                else {
                    if (counter !== 0) {
                        scroller.hide();
                    }
                }
               
            }
            if (dimnow.width !== dimthen.width || dimnow.height !== dimthen.height) {
                dimthen = dimnow;
                targetheight = target.outerHeight();
                var sumHeight = totalHeight(target);
                scrollerheight = (targetheight / sumHeight) * targetheight;
                diff = sumHeight - targetheight;
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
                var sumHeight = totalHeight(target);
                scrollerheight = (target.outerHeight() / sumHeight) * target.outerHeight();
                scroller.css({ 'height': scrollerheight });
            }
            counter++;
        });
        var startypost = 0;
        var ymove = 0;
        var startscroll = 0;
        var toleranceobj = { 'right': scroller.offset().left + scroller.outerWidth() + scrollareatolerance };
        scroller.bind(mousedown, function (e) {
            touch = true;
            startypost = scroller.position().top;
            ymove = e.pageY;
            startscroll = target.scrollTop();
            scroller.removeClass('animate');
            target.addClass('custom-scroll-noselect');
            $('body').addClass('custom-scroll-noselect');
            
        });
        $(window).bind(mousemove, function (e) {
            if (touch) {
                var movement = ymove - e.pageY;
                targetheight = target.outerHeight();
                scrollerheight = (targetheight / totalHeight(target)) * targetheight;
                var scrollerpost = Math.min(Math.max((startypost - movement), targetpost), (targetheight - scrollerheight) + targetpost);
                diff = totalHeight(target) - target.height();
                var adder = (totalHeight(target) - (targetheight - targetpost)) / (scrollarea);
                scroller.css('top', scrollerpost);
                target.scrollTop((scrollerpost - targetpost) * adder);
            }
        });
        $(window).bind(mouseup, function () {
            touch = false;
            $('body').removeClass('custom-scroll-noselect');
            scrollWrapper.addClass('custom-scroll-noselect');
            scroller.addClass('animate');
        });
        
        $this.bind('mouseleave.customscroll', function (e) {
           touch = false;
        })
        scrollWrapper.click(function (e) {
            var post = e.pageY - target.offset().top;
            var scrollpost = (scrollarea / diff);
            var top = Math.min(Math.max(post, 0), scrollarea);
            target.scrollTop((top / scrollpost));
        });

    })
    return false;
}