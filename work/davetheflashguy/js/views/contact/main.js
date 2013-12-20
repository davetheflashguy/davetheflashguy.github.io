define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/contact/body.html'
], function($, _, Backbone, contactTemplate){

  var contactView = Backbone.View.extend({
    el: $("#page"),

    render: function(){      
        var compiledTemplate = _.template(contactTemplate);
        this.$el.html(compiledTemplate);

        $('#banner').css('background-image','url(../imgs/banner-contact.jpg)')
    }

  });

  return contactView;
  
});
