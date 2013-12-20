define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/visions/body.html?s='+Math.random() * 99999,
], function($, _, Backbone, visionsTemplate){

  var visionsView = Backbone.View.extend({
    el: $("#page"),

    render: function(){      
        var compiledTemplate = _.template(visionsTemplate);
        this.$el.html(compiledTemplate);

        $('#banner').css('background-image','url(../imgs/banner-visions.jpg)')
    }

  });

  return visionsView;
  
});
