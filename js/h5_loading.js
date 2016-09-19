var H5_loading = function (images, firstpage) {
    var id = this.id;

    if (this._imagesLength === undefined) { //第一次进入
        this._imagesLength = (images || []).length;
        this._loaded = 0;

        window[id] = this; //把当前对象存储在全局对象 winodw 中，用来进行某个图片加载完成之后的回调


        for (s in images) {
            var item = images[s];
            var img = new Image;
            img.onload = function () {
                window[id].loader();
            }
            img.src = item;
        }

        $('#rate').text('0%');
        return this;
    } else {
        this._loaded++;
        $('#rate').text(((this._loaded / this._imagesLength) * 100 >> 0) + "%");

        if (this._loaded < this._imagesLength){
            return this;
        }
    }

    window[id] = null;

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
}