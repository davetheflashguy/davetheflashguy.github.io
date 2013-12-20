define(['jquery',
        'jqueryui',
        'underscore',
        'backbone'], 
function($, $ui, _, Backbone)
{
    var appView = Backbone.View.extend(
    {
        /* Master DOM element */
        el              : $("#dialog_container"),


        /* sign in url web service url */
        sign_in_url     : "",

        /* When our router sees a change and instantiates
           this view, initialize is the first method that gets
           called.  Anything that we want to happen before
           the view is rendered happens here */
        initialize      : function()
        {
            
        },
        change          : function(){
     
        },
        modelBind       : function(model){
          
        },
        render          : function()
        {
            var html =  "<div id='dialog'>";
            var connMsg = "Please check your network connection and try again.";
            
                html += "<p>"+connMsg+"</p>";
                html += "</div>";
                
                
            this.$el.html(html);
           

            $('#dialog').dialog({
                title         : 'No Internet Connection',
                modal         : true,
                resizable     : true,
                width         : 300,
                height        : 225,
                draggable     : true,
                show          : 'fade',
                hide          : 'fade',
                dialogClass   : 'main-dialog-class',
                buttons: 
                {
                    'Close': function() 
                    {
                        $(this).dialog('close');
                    }
                }
                
            });
        }
        

    });
    return appView;
});