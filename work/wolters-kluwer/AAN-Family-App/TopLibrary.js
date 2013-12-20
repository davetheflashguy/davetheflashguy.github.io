// Top Library
// --------------
var TopLibrary = Backbone.View.extend({
    initialize : function(){
        var html = "<h1>Top Level Library</h1>";
        this.template = _.template(html);
    },
    render : function(){
        return this;
    }
});