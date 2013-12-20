define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/global/menu.html'
], function($, _, Backbone, MenuTemplate){

  var appView = Backbone.View.extend({
      el: $("nav"),

      render: function(){
        var compiledTemplate = _.template(MenuTemplate);
        this.$el.html(compiledTemplate);
      }

  });

  return appView;
});