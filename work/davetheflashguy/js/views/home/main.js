define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home/body.html'
], function($, _, Backbone, homeTemplate){

  var HomeView = Backbone.View.extend({
    el: $("#page"),

    render: function(){      
        var compiledTemplate = _.template(homeTemplate);
        this.$el.html(compiledTemplate);
    }

  });

  return HomeView;
  
});
