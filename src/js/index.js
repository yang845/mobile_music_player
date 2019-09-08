var root = window.player;
var dataList = [];
var len;
var audio = root.audioManager;
var control;
var timer = null;

function getData(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (data) {
            console.log(data);
            dataList = data;
            len = dataList.length;
            control = new root.controlIndex(len);
            root.render(data[0]);
            root.pro.renderAllTime(dataList[0].duration);
            renderSongList(data);
            audio.getAudio(data[0].audio);
            bindEvent();
        },
        error: function () {
            console.log('error');
        }
    })
}

function bindEvent() {
    $('body').on('play:change', function (e, index) {
        root.render(dataList[index]);
        audio.getAudio(dataList[index].audio);
        root.pro.start(0);
        if (audio.status == 'play') {
            audio.play();
            rotated(0);
        }else {
            root.pro.stop();
        }

        $('.img-box').attr('data-deg', 0);
        $('.img-box').css({
            transform: 'rotateZ(0deg)',
            transition: 'none'
        });
        root.pro.renderAllTime(dataList[index].duration);
    });
    $('.prev').on('click', function () {
        var i = control.prev();
        $('body').trigger('play:change', i);
    });
    $('.next').on('click', function () {
        var i = control.next();
        $('body').trigger('play:change', i);
    });

    $('.play').on('click', function () {
        if (audio.status == 'pause') {
            audio.play();
            root.pro.start();
            var deg = parseInt($('.img-box').attr('data-deg'));
            rotated(deg);
        } else {
            clearInterval(timer);
            root.pro.stop();
            audio.pause();
        }
        $('.play').toggleClass('playing');
    });
    $('.list').on('click', function () {
        $('.modal-con .active').removeClass('active');
        $('.modal-con a').eq(control.index).addClass('active');
        $('.modal').show();
    });
    // 
    $('.close').add('.modal').on('click', function () {
        $('.modal').hide();
    });
    (function () {
        var offset = $('.pro-bottom').offset();
        var left = offset.left;
        var w = offset.width;

        $('.spot').on('touchstart', function () {
            root.pro.stop();
        }).on('touchmove', function (e) {
            var x = e.changedTouches[0].clientX;
            var per = (x - left) / w;
            if (per >= 0 && per <= 1) {
                root.pro.update(per);
            }
        }).on('touchend', function (e) {
            var x = e.changedTouches[0].clientX;
            var per = (x - left) / w;
            if (per >= 0 && per <= 1) {
                var curTime = per * dataList[control.index].duration;
                $('.play').addClass('playing');
                audio.playTo(curTime);
                audio.status = 'play';
                audio.play();
                root.pro.start(per);
            }
        });
    })();
    (function () {
        var startx,
            endx;
        $('.song').on('touchstart', function (e) {
            var touch = e.changedTouches;
            startx = touch[0].clientX;
        }).on('touchend', function (e) {
            var touch = e.changedTouches;
            endx = touch[0].clientX;
            // console.log(startx, endx)
            if (startx - endx > 150) {
                $('.prev').trigger('click');
            }else if(endx - startx > 150) {
                $('.next').trigger('click');
            }
        })
    })();
    // 列表切歌
    $('.modal-con li').on('click', function () {
        var index = parseInt($(this).attr('data-index'));
        $('.modal-con .active').removeClass('active');
        $('a', this).addClass('active');
        control.index = index;
        audio.play();
        $('.play').addClass('playing');
        $('body').trigger('play:change', index);
    })
    $('.like').on('click', function () {
        $('.like').toggleClass('liking');
    });
}

function rotated(deg) {
    clearInterval(timer);
    timer = setInterval(function () {
        deg += 2;
        $('.img-box').attr('data-deg', deg);
        $('.img-box').css({
            transform: 'rotateZ(' + deg + 'deg)',
            transition: 'all 0.2s ease-in'
        });
    }, 200);
}

// 渲染歌曲列表
function renderSongList(data, index) {
    var str = '';
    data.forEach(function (item, i) {
        str += '<li data-index=' + i + '>\
                <a>' + item.song + '--' + item.singer + '</a>\
            </li>';
    });
    $('.modal-con ul').html(str);
    $('.modal-con a').eq(0).addClass('active');
}

getData('../mock/data.json');