var isAPIAvailable = true;
var version = "2.1.7";

// ---------------
// The Application Shell
// --------------

// The Application Shell - TODO: Write default collection and model for application
// ---------------
// Our overall **AppView** is the top-level piece of UI.
var AppView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function() {
        FastClick.attach(document.body);
    },
});