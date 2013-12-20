define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/global/footer.html'
], function($, _, Backbone, FooterTemplate){

  var appView = Backbone.View.extend({
      el: $("footer"),

      render: function(){
        var compiledTemplate = _.template( FooterTemplate );
        this.$el.html(compiledTemplate);
      }

  });

  return appView;
});