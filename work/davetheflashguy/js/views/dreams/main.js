define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/dreams/body.html'
], function($, _, Backbone, dreamsTemplate){

  var HomeView = Backbone.View.extend({
    el: $("#page"),

    render: function(){      
        var compiledTemplate = _.template(dreamsTemplate);
        this.$el.html(compiledTemplate);
    }

  });

  return HomeView;
  
});
