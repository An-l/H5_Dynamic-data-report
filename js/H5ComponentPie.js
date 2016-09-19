/*饼图组件对象*/
/*mark  1.加入一个画布-背景
 *      2.加入一个画布-数据层
 *      3.加入一个画布-蒙版层
 *      4.项目文本（通过per控制文本动画）
 *      5.生长动画（重点：draw（per））
 *   */
var H5ComponentPie = function (name, cfg) {
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

    //备用颜色库
    var colors = ['red', 'green', 'blue', 'orange', 'grey'];

    var sAngel = 1.5 * Math.PI; //开始角度
    var eAngel = 0; //结束角度
    var aAngel = Math.PI * 2; //360度

    var step = cfg.data.length;
    for (var i = 0; i < step; i++) {
        var item = cfg.data[i];
        var color = item[2] || (item[2] = colors.pop());

        eAngel = sAngel + aAngel * item[1];

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        ctx.moveTo(r, r);
        ctx.arc(r, r, r, sAngel, eAngel);
        ctx.fill();
        //ctx.stroke();

        sAngel = eAngel;

        var text = $('<div class="text">');
        text.text(cfg.data[i][0]);
        var per = $('<div class="per">');
        per.text(cfg.data[i][1] * 100 + '%');
        text.append(per);

        var x = r + Math.sin(.5 * Math.PI - sAngel) * r;
        var y = r + Math.cos(.5 * Math.PI - sAngel) * r;

        if (x > w / 2) {
            text.css('left', x / 2);
        } else {
            text.css('right', (w - x) / 2);
        }
        if (y > h / 2) {
            text.css('top', y / 2 + 5);
        } else {
            text.css('bottom', (h - y) / 2 + 5);
        }

        text.css('opacity', 0);

        if (cfg.data[i][2]) {
            text.css('color', cfg.data[i][2]);
            //todo
            text.css('color', '#fff');
            text.css('backgroundColor', cfg.data[i][2]);
        }

        component.append(text);
    }


    // 加入一个蒙版层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex', 3);
    component.append(cns);

    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;


    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.arc(r, r, r, 0, 2 * Math.PI);

    // 生长动画
    var draw = function (per) {
        if (per >= 1) {
            component.find('.text').css('transition', 'all 0s');
            H5ComponentPie.reSort(component.find('.text'));
            component.find('.text').css('transition', 'all 1s');
            component.find('.text').css('opacity', 1);
        }
        if (per <= 1) {
            component.find('.text').css('opacity', 0);
        }

        ctx.clearRect(0, 0, w, h);

        ctx.beginPath();
        ctx.moveTo(r, r);

        if (per <= 0) {
            ctx.arc(r, r, r, 0, 2 * Math.PI);
        } else {
            ctx.arc(r, r, r, sAngel, sAngel + 2 * Math.PI * per, true);
        }

        ctx.fill();
    };

    //先绘制一个蒙版，遮蔽主要内容，再进行生长动画
    draw(0);
    component.on('onLoad', function () {
        //饼图生长动画
        var s = 0;
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s += .01;
                draw(s);
            }, i * 10 + 500);
        }
    });
    component.on('onLeave', function () {
        //饼图生长动画
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

H5ComponentPie.reSort = function (list) {
    //  1.检测相交
    var compare = function (domA, domB) {
        // 元素位置，不直接使用left(),因为有时元素left为auto
        var offsetA = $(domA).offset();
        var offsetB = $(domB).offset();
        // domA的投影
        var shadowA_x = [offsetA.left, $(domA).width() + offsetA.left];
        var shadowA_y = [offsetA.top, $(domA).height() + offsetA.top];

        // domB的投影
        var shadowB_x = [offsetB.left, $(domB).width() + offsetB.left];
        var shadowB_y = [offsetB.top, $(domB).height() + offsetB.top];

        // 检测x
        var intersect_x = (shadowA_x[0] > shadowB_x[0] && shadowA_x[0] < shadowB_x[1])
            || (shadowA_x[1] > shadowB_x[0] && shadowA_x[1] < shadowB_x[1]);

        // 检测y
        var intersect_y = (shadowA_y[0] > shadowB_y[0] && shadowA_y[0] < shadowB_y[1])
            || (shadowA_y[1] > shadowB_y[0] && shadowA_y[1] < shadowB_y[1]);


        return intersect_x && intersect_y;
    }

    //  2.错开重排
    var reset = function (domA, domB) {
        if ($(domA).css('top') != 'auto') {
            $(domA).css('top',parseInt($(domA).css('top'))+$(domB).height());
        }
        else if ($(domA).css('bottom') != 'auto') {
            $(domA).css('bottom',parseInt($(domA).css('bottom'))+$(domB).height());
        }
    }

    // 定义要重排的元素
    var willReset = [list[0]];

    $.each(list, function (i, domTarget) {
        if (compare(willReset[willReset.length-1],domTarget)){
            willReset.push(domTarget);
        }
    });

    if (willReset.length>1){
        $.each(willReset, function (i,domA) {
            if (willReset[i+1]){
                debugger
                reset(domA,willReset[i+1]);
            }
        });
        H5ComponentPie.reSort(willReset);
    }
}