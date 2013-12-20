define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/global/header.html'
], function($, _, Backbone, HeaderTemplate){

  var appView = Backbone.View.extend({
      el: $("header"),

      render: function(){
        var compiledTemplate = _.template( HeaderTemplate );
        this.$el.html(compiledTemplate);
      }

  });

  return appView;
});