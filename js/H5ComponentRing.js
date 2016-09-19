/*环图组件对象*/
/*mark  1.加入一个画布-背景
 *      2.加入一个画布-数据层
 *      3.加入一个画布-蒙版层
 *      4.项目文本（通过per控制文本动画）
 *      5.生长动画（重点：draw（per））
 *   */
var H5ComponentRing = function (name, cfg) {
    var component = new H5ComponentBase(name, cfg);

    var w = cfg.width;
    var h = cfg.height;

    //加入一个画布（背景）
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex', 1);
    component.append(cns);

    var r = w / 2;

    //加入一个底层
    ctx.beginPath();
    ctx.fillStyle = '#eee';
    //ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.arc(r, r, r, 0, 2 * Math.PI);
    ctx.fill();
    //ctx.stroke();

    //绘制数据层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex', 2);
    component.append(cns);


    var sAngel = 1.5 * Math.PI; //开始角度
    var eAngel; //结束角度
    var aAngel = Math.PI * 2; //360度


    var item = cfg.data[0];
    var color = item[2] || (item[2] = '#FF8C00');

    //eAngel = sAngel + aAngel * item[1] - aAngel;

    var mask = $('<div class="mask">');
    mask.width(r);
    mask.height(r);
    var text = $('<div class="text">');
    text.text(item[0]);
    text.css('opacity',0);
    var per = $('<div class="per">');
    per.text(item[1] * 100 + '%');
    text.append(per);
    mask.append(text);

    if (item[2]) {
        text.css('color', item[2]);
    }
    component.append(mask);


    // 生长动画
    var draw = function (per) {
        if (per >= 1) {
            component.find('.text').css('opacity', 1);
        }
        if (per <= 1) {
            component.find('.text').css('opacity', 0);
        }

        ctx.clearRect(0, 0, w, h);

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        ctx.moveTo(r, r);
        ctx.arc(r, r, r, sAngel,sAngel + aAngel * item[1]*per);
        ctx.fill();
    };

    //draw(1);
    component.on('onLoad', function () {
        //环图生长动画
        var s = 0;
        for (var i = 0; i < 50; i++) {
            setTimeout(function () {
                s += .02;
                draw(s);
            }, i * 10 + 500);
        }
    });
    component.on('onLeave', function () {
        //环图生长动画
        var s = 1;
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s -= .01;
                draw(s);
            }, i * 10);
        }
    });

    return component;
};