require.config({
  paths: {
    jquery                      : '../jquery-min',
    jqueryui                    : 'jquery-ui-1.9.2.custom.min', 
    jquerymove                  : 'plugins/jquery.event.move', 
    jqueryswipe                 : 'plugins/jquery.event.swipe', 
    jqueryfastclick             : 'plugins/fastclick', 
    jqueryscroll                : 'plugins/jquery.jscrollpane.min', // this can be removed // todo
    swipeview                   : 'plugins/swipeview',
    underscore                  : '../underscore',
    backbone                    : '../backbone',
    text                        : '../text',
    json2                       : '../json2',
    storeAPI                    : 'storeAPI',
    imageWrapperControl         : 'ImageWrapperControl',
    toolTip                     : 'wz_tooltip',
    fullText                    : 'fulltext',
    zoom                        : 'zoom',
  }

});

require(['app', 'json2'], function(app) {
    app.initialize();
});