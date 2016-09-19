/*整体页面结构*/
/*  1.addPage()
 *   2.addComponent()
 *   3.loader()
 * */
var h5 = function () {
    this.page = [];     //将每一个添加的page放进this.page，this.page.slice(-1)[0]为最后添加的page
    this.id = ('h5_'+Math.random()).replace('.','_');
    this.el = $('<div class="h5" id="'+this.id+'">').hide();
    $('body').append(this.el);

    this.addPage = function (name, text) {
        var page = $('<div class="section h5_page">');  //section类名是fullpage的page
        if (name != undefined) {
            page.addClass('h5_page_' + name);
        }
        if (text != undefined) {
            page.text(text);
        }

        this.page.push(page);
        this.el.append(page);

        if (typeof this.whenAddPage === 'function') {
            this.whenAddPage();
        }

        //链式调用
        return this;
    };

    this.addComponent = function (name, cfg) {
        //component = new H5ComponentBase(name, cfg);
        //page = this.page.slice(-1)[0];
        //console.log(this.page);
        //page.append(component);
        var cfg = cfg || {};

        cfg = $.extend({
            type: 'base'
        }, cfg)

        var component;
        var page = this.page.slice(-1)[0];
        switch (cfg.type) {
            case 'base':
                component = new H5ComponentBase(name, cfg);
                break;
            case 'polyline':
                component = new H5ComponentPolyline(name, cfg);
                break;
            case 'pie':
                component = new H5ComponentPie(name, cfg);
                break;
            case 'bar':
                component = new H5ComponentBar(name, cfg);
                break;
            case 'bar_v':
                component = new H5ComponentBar_v(name, cfg);
                break;
            case 'radar':
                component = new H5ComponentRadar(name, cfg);
                break;
            case 'ring':
                component = new H5ComponentRing(name, cfg);
                break;
            case 'point':
                component = new H5ComponentPoint(name, cfg);
                break;
            default:
        }
        page.append(component);
        //链式调用
        return this;
    };

    this.loader = function (firstpage) {
        this.el.fullpage({
            onLeave: function (index, nextIndex, direction) {
                $(this).find('.h5_component').trigger('onLeave');
            },
            afterLoad: function (anchorLink, index) {
                $(this).find('.h5_component').trigger('onLoad');
            }
        });
        //页面刷新时直接触发首页中h5_component组件的onLoad事件
        this.page[0].find('.h5_component').trigger('onLoad');
        this.el.show();
        if (firstpage) {
            $.fn.fullpage.moveTo(firstpage);
        }
    };

    this.loader = typeof H5_loading == 'function' ? H5_loading : this.loader;

    return this;
};