define(['jquery',
        'underscore',
        'backbone'], 
function($, _, Backbone)
{
    var view = Backbone.View.extend(
    {
        el: $("#container"),
        initialize: function()
        {
          
        },
        modelBind: function(model)
        {
          
        },
        render: function()
        {
            
            var html = "<div id='links_container'>";
                html += "<div id='icon_container'>";
                html += "<a href='http://www.facebook.com/pages/Journal-of-Neuro-Ophthalmology/133873386700634' style='text-decoration:none;' target='_blank'><div id='facebook_icon'></div>";
                html += "<div id='icon_label'>FACEBOOK</div></a>";
                html += "</div>"; // end icon_container
                html += "<div id='twitter_container'>";
                html += "<a href='http://twitter.com/journalneurooph' style='text-decoration:none; margin-left:25px'  target='_blank'><div id='twitter_icon'></div>";
                html += "<div id='icon_label'>TWITTER</div></a>";
                html += "</div>"; // end icon_container
                html += "</div>"// end links container
            
            this.$el.html(html);
        }
      });
    return view;
});