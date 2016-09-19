/*散点图表组件对象*/
/*mark  1.基于H5ComponentBase对象，创建容器component
 *       2.遍历cfg.data
 *       3.确定散点图结构 point（name（rate））
 *       4.按顺序添加进component容器中
 *       5.return component
 * */
var H5ComponentPoint = function (name, cfg) {
    var component = new H5ComponentBase(name, cfg);

    var base = cfg.data[0][1];  //以第一个数据的比例为大小的100%

    $.each(cfg.data, function (idx, item) {
        var point = $('<div class="point point_' + idx + '">');
        var name = $('<div class="name">'+item[0]+'</div>');
        var rate = $('<div class="per">'+(item[1]*100+"%")+'</div>');

        name.append(rate);
        point.append(name);


        var per = (item[1] / base) * 100 + '%';
        point.width(per).height(per);

        if (item[2]) {
            point.css('backgroundColor', item[2]);
        }
        if (item[3] != undefined && item[4] != undefined) {
            point.css({
                'left':item[3],
                'top':item[4]
            });
        }

        point.css('transition','all 1s ' +.5*idx+'s');

        component.append(point);
    });

    component.find('.point').on('click', function () {
        component.find('.point').removeClass('point_focus');
        $(this).addClass('point_focus');

        return false;
    }).eq(0).addClass('point_focus');

    return component;
};