/*基本图文组件对象*/
/*mark   1.获取cfg，设置component属性（text,width,height,bg,css,center)
 *       2.为component绑定onLoad事件（addClass，cfg.animateIn）
 *       3.为component绑定onLeave事件（removeClass，cfg.animateOut）
 *       4.return component
 * */
var H5ComponentBase = function (name, cfg) {
    var cfg = cfg || {};

    var cls = 'h5_component h5_component_' + cfg.type + ' h5_component_name_' + name;
    var component = $('<div class="' + cls + '">');

    cfg.text && component.text(cfg.text);
    cfg.width && component.width(cfg.width / 2);
    cfg.height && component.height(cfg.height / 2);
    cfg.bg && component.css('backgroundImage', "url(" + cfg.bg + ")");
    cfg.css && component.css(cfg.css);
    if (cfg.center === true) {
        component.css({
            left: "50%",
            marginLeft: cfg.width / 4 * -1
        });
    }
    if (typeof cfg.onclick === 'function'){
        component.on('click',cfg.onclick);
    }

    component.on('onLoad', function () {
        setTimeout(function () {
            component.addClass('h5_component_'+cfg.type+'_load').removeClass('h5_component_'+cfg.type+'_leave');
            cfg.animateIn && component.animate(cfg.animateIn);
        },cfg.delay||0);

        //阻止事件冒泡
        return false;
    });

    component.on('onLeave', function () {
        setTimeout(function () {
        component.addClass('h5_component_'+cfg.type+'_leave').removeClass('h5_component_'+cfg.type+'_load');
        cfg.animateOut && component.animate(cfg.animateOut);
        },cfg.delay||0);
        //阻止事件冒泡
        return false;
    });

    return component;
}