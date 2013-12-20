define(['jquery',
        'jqueryui',
        'underscore',
        'backbone', 
        'views/base'], 
function($, $ui, _, Backbone, BaseView)
{
    var appView = BaseView.extend(
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
            /* This should probably imported into the CSS files */
            this.loadCSS(["login"]);
            this.loadCSS(['ui-darkness/jquery-ui-1.9.2.custom']);
            this.sign_in_url = this.globalModel.sign_in_with_credentials;
        },
        change          : function(){
     
        },
        modelBind       : function(model){
          
        },
        render          : function()
        {

            var myEvent = this.eventAggregator;
            var myWebservice = this.sign_in_url;
            var self = this;
            var html = "<div id='dialog'>";
                html += "<div class = 'view_signin'>";
                html += '<p class="validateTips">Please sign into your account</p>';
                html += '<form>';
                html += '<fieldset>';
                html += '<input type="text" name="name" id="name" value="Username" onkeydown="if(this.value==\'Username\'){this.value=\'\';}" onblur="if(this.value==\'\') this.value=\'Username\';" class="text ui-widget-content ui-corner-all" />';
                html += '<input value="Password" name="password" id="password"  onkeydown="if(this.type!=\'password\'){this.type=\'password\';this.value=\'\';}" onblur="if(this.value==\'\') this.value=\'Password\';" class="text ui-widget-content ui-corner-all">';
                html += '</fieldset>';
                
                html += '</form>'
                html += '</div>'
                html += '<div id="forgot_password"><a href="'+this.globalModel.forgot_password_url+'" target="_blank"><p>Forgot Password?</p></a></div>';
                html += '<div id="register_account"><a href="'+this.globalModel.register_account_url+'" target="_blank"><p>Create an Account</p></a></div>';
                html += '</div>';
                
            this.$el.html(html);
            
            var name        = $( "#name" ),
                password    = $( "#password" ),
                allFields   = $( [] ).add( name ).add( password ),
                tips        = $( ".validateTips" );

            function updateTips( t ) {
                tips
                    .text( t )
                    .addClass( "ui-state-highlight" );
                setTimeout(function() {
                    tips.removeClass( "ui-state-highlight", 1500 );
                }, 500 );
            }
 
            function checkLength( o, n, min, max ) {
                if ( o.val().length > max || o.val().length < min ) {
                    o.addClass( "ui-state-error" );
                    updateTips( "Please provide a " + n + "." );
                    return false;
                } else {
                    return true;
                }
            }
 
            function checkRegexp( o, regexp, n ) {
                if ( !( regexp.test( o.val() ) ) ) {
                    o.addClass( "ui-state-error" );
                    updateTips( n );
                    return false;
                } else {
                    return true;
                }
            }       

            $('#dialog').dialog({
                title         : 'Sign In',
                modal         : true,
                resizable     : true,
                width         : 400,
                height        : 335,
                draggable     : true,
                show          : 'fade',
                hide          : 'fade',
                dialogClass   : 'main-dialog-class',
                buttons: 
                {
                    'Sign In': function() 
                    {
                        var bValid = true;

                        allFields.removeClass( 'ui-state-error' );

                        bValid = bValid && checkLength( name, 'username', 0, 20);
                        bValid = bValid && checkLength( password, 'password', 0, 20);
     
                        if (bValid)
                        {
                            $('#users tbody').append('<tr>' +'<td>' + name.val() + '</td>' + '<td>' + password.val() + '</td>' + '</tr>');
                            getAuthToken(name.val(), password.val(),myEvent,myWebservice);
                        }
                    },
                    Cancel: function() 
                    {
                        $(this).dialog('close');
                    }
                },
                close: function() 
                {

                }
            });
        }
    },
    
    /*  
        This method will take a username and password
        and tap into our webservices to retrieve a valid
        token so we can log our user into DPS
    */
    getAuthToken = function(_username, _password, _event, _service){
        var username = _username//"sunilbh"; // hardcoded for testing
        var password = _password//  "cybage@123"; // hardcoded for testing
        // make an ajax request to the webservice using jquery
        var web_service_url = _service;
            web_service_url = web_service_url.replace("{username}", username);
            web_service_url = web_service_url.replace("{password}", password);

        $.ajaxSetup({
            error: function(event, request, options, error) 
            {
                switch (event.status) 
                {
                    case 401: 
                        var tips = $( ".validateTips" );
                            tips.text("Invalid credentials").addClass( "ui-state-highlight" );
                    break;
                }
            }
        });
        
        $.ajax({
            url: web_service_url,
        }).done(function(data) { 
            var httpResponseCode = $(data).find('result').attr('httpResponseCode');
            // valid response
            if (httpResponseCode == "200")
            {
                var authToken = $(data).find('authToken').text();
                // try and log the user into DPS
                adobe.dps.store.setUserInfo(authToken, username);
                // close the dialog box
                $("#dialog").dialog('close');
                // dispatch login state change event
               _event.trigger("loginStateChange");
               //adobe.dps.store.getUserInfo();
            }
        });
    });
    return appView;
});