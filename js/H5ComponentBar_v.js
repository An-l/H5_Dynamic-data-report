/*柱图组件对象*/
/*mark  1.基于H5ComponentBase对象，创建容器component
*       2.遍历cfg.data
*       3.确定柱图结构 line（name，rate（bg），per）
*       4.按顺序添加进component容器中
*       5.return component
* */
var H5ComponentBar_v = function (name, cfg) {
    var component = new H5ComponentBase(name, cfg);

    var rowWidth = 100/cfg.data.length + '%';
    $.each(cfg.data, function (idx, item) {

        var line = $('<div class="line">');
        var name = $('<div class="name">');
        var rate = $('<div class="rate">');
        var bg = $('<div class="bg">')
        var per = $('<div class="per">');

        var rateHeight = item[1]*100 + '%';

        if (item[2]){
            bg.css('backgroundColor',item[2]);
        }

        name.text(item[0]);
        per.text(rateHeight);

        line.css('width',rowWidth);
        rate.css('height',rateHeight);
        rate.append(bg).append(per);

        line.append(name).append(rate);

        component.append(line);
    });

    return component;
};