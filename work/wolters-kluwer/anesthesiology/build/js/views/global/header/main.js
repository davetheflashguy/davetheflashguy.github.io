define(['views/base'], 
function(BaseView)
{
    var headerView = BaseView.extend(
    {
        el: $("#header_container"),

        render: function()
        {
            var html = "<div id='header'>";
                html += "<div id='logo'><div id='back_btn_container' style='display:none'><div id='back_btn'></div></div></div>";
                html += "</div>";
                
            this.$el.html(html);

            $("#back_btn").click(function() {
                window.history.back();
            }); 
        },

        /* Public called by router */
        showBackButton : function(){
            $('#back_btn_container').fadeIn('fast');
        },

        hideBackButton : function(){
            $('#back_btn_container').fadeOut('fast');   
        }

      });
    return headerView;
});