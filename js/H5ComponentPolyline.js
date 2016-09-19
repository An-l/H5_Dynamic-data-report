/*折线图组件对象*/
/*mark 1.加入一个画布-网格线背景（水平，垂直）
*      2.加入一个画布-折线图
*      3.点
*      4.连线
*      5.阴影
*      6.写数据（百分比，项目文本）
*      7.生长动画（重点）
*   */
var H5ComponentPolyline = function (name, cfg) {
    var component = new H5ComponentBase(name, cfg);

    //绘制网格线 - 背景层
    var w = cfg.width;
    var h = cfg.height;

    //加入一个画布（网格线背景）
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    //设置画笔
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#595959";

    //水平网格线 -> 10份
    var step = 10;
    for (var i = 0; i < step + 1; i++) {
        var y = (h / step) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
    }

    //垂直网格线 (根据项目个数 cfg.data.length)
    step = cfg.data.length + 1;
    var text_w = w / step >> 0;

    for (var i = 0; i < step + 1; i++) {
        var x = (w / step) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);

        //添加项目文本
        if (cfg.data[i]) {
            var text = $('<div class="text">');
            text.text(cfg.data[i][0]);
            text.width(text_w).css('left', x / 2);
            text.css('opacity',0).css('transition','all .5s ' +.1*i+'s');

            component.append(text);
        }
    }
    ctx.stroke();

    //加入一个画布 - 数据层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    /**绘制折线以及对应的数据和阴影
     * {float} per 0到1之间的数据，会根据这个值绘制最终数据对应的中间状态
     **/
    var draw = function (per) {
        if (per>=1){
            component.find('.text').css('opacity',1);
        }
        if (per<=1){
            component.find('.text').css('opacity',0);
        }
        //清空画布
        ctx.clearRect(0,0,w,h);

        //绘制折线数据
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ff8878";
        ctx.fillStyle = '#ff8878';

        var x = 0;
        var y = 0;

        var row_w = (w / (cfg.data.length + 1));    //每列的宽度

        //画点
        for (i in cfg.data) {
            var item = cfg.data[i];

            x = row_w * i + row_w;
            y = h - (item[1] * h * per);

            ctx.beginPath();
            ctx.arc(x, y,5, 0, 2 * Math.PI);
            ctx.fill();
        }

        //连线
        ctx.moveTo(row_w, h - (cfg.data[0][1] * h * per)); //移动画笔到第一个数据的点位置
        for (i in cfg.data) {
            var item = cfg.data[i];
            x = row_w * i + row_w;
            y = h - (item[1] * h * per);
            ctx.lineTo(x, y);   //此时画笔在最后一个点位置
        }
        ctx.stroke();


        //绘制阴影
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,118,118,0)';//隐藏绘制的阴影线

        ctx.lineTo(x, h);
        ctx.lineTo(row_w, h);
        ctx.fillStyle = 'rgba(255,118,118,.37)';
        ctx.fill();

        //写入百分比数据
        for (i in cfg.data) {
            var item = cfg.data[i];
            x = row_w * i + row_w;
            y = h - (item[1] * h * per);
            ctx.fillStyle = item[2] || '#595959';
            ctx.fillText((item[1] * 100) + '%', x - 6, y - 10);
        }


        ctx.stroke();
    };

    component.on('onLoad', function () {
        //折线图生长动画
        var s = 0;
        for (var i=0;i<100;i++){
            setTimeout(function () {
                s+=.01;
                draw(s);
            },i*10+500);
        }
    });
    component.on('onLeave', function () {
        //折线图生长动画
        var s = 1;
        for (var i=0;i<100;i++){
            setTimeout(function () {
                s-=.01;
                draw(s);
            },i*10);
        }

    });

    return component;
};