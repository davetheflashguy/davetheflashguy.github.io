define(['views/base'], function(BaseView)
{
    var menuView = BaseView.extend(
    {
        el: $("#menu_container"),
        
        initialize: function()
        {

        },
        modelBind: function(model)
        {
          
        },
        render: function()
        {
          var html = "<div id='menu'>";
              html += "<ul>";
              html += "<li class='first'><a href='#'' >Current Issue</a></li>";
              html += "<li><a href='#/featured'>Featured</a></li>";
              html += "<li><a href='#/oa'>Open Access</a></li>"; 
              html += "</ul>";
              html += "</div>";
        
          this.$el.html( html );
          var lastClass = null;
          $("#menu li" ).live('click', function(e) {
            $("#menu li" ).removeClass('first');
            $(this).addClass('first');
          });
        }
      });
    return menuView;
});