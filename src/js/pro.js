
// 渲染每首歌的时间
(function ($, root) {
    var frameId;
    var allTime;
    var startTime;
    var lastPer = 0;
    function renderAllTime(time) {
        allTime = time;
        time = formatTime(time);
        $('.all-time').html(time);
    }

    function formatTime(time) {
        time = Math.round(time);
        var m = Math.floor(time / 60);
        var s = time - m * 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        return m + ':' + s;
    }

    function start(t) {
        lastPer =  t == undefined ? lastPer : t;
        startTime = new Date().getTime();
        cancelAnimationFrame(frameId);
        function frame() {
            curTime = new Date().getTime();
            var per = lastPer + (curTime - startTime) / (allTime * 1000);
            if (per <= 1) {
                update(per);
            }else {
                cancelAnimationFrame(frameId);
            }
            frameId = requestAnimationFrame(frame);
        }
        frame();
    }

    function update(per) {
        var time = formatTime(allTime * per);
        $('.cur-time').html(time);
        var perX = (per - 1) * 100 + '%';
        $('.pro-top').css({
            transform: 'translateX('+ perX +')'
        })
    }

    function stop() {
        cancelAnimationFrame(frameId);
        var stopTime = new Date().getTime();
        lastPer = lastPer + (stopTime - startTime) / (allTime * 1000);
    }

    root.pro = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        update: update
    }

})(window.Zepto, window.player || (window.player = {}));