// Login View
// --------------
var LoginView = Backbone.View.extend({
    // The FamilyAppView listens for changes to its model, re-rendering.
    initialize: function() {
        var html = '<div class="modal-background-grey">';
            html += '<form id="login">';
            html += '<div class="title">Sign In<div id="close" src="icon_close.png"></div></div>';
            html += '<div class="description">Please sign in to your account.</div>'
            html += '<input id="username" type="text" name="username" placeholder="Username">';
            html += '<input id="password" type="password" name="password" placeholder="Password">';
            html += '<div class="link"><a href="#">Forgot password?</a></div>';
            html += '<div id="submit">Sign In</div>';
            //html += '<div class="error"></div>';
            html += '<div id=\"login-custom-text\">AAN Members: please sign in with your AAN member credentials. New members should <a href=\"http://journals.lww.com/_layouts/DPS/Register.aspx?journalid=neurology\">create an account</a>.You can also user your LWW journals username and password.</br></br> If you need assistance please call 1-866-489-0443 (outside North America call 1-301-223-2300) or e-mail <a href="mailto:memberservice@lww.com">Customer Service.</a></div>';
            html += '</form></div>';
        this.template = _.template(html);
        this.render();
    },
    // Render the sign in module
    render: function() {
        this.$el.html(this.template());

        var self = this;
        
        this.$el.find("#submit").click(function (){
            self.submit();
        });

        this.$el.find("#close").click(function (){
            self.remove();
            window.history.back();
        });

        return this;
    },
    submit : function(){

        var self = this;
        
        $("#username").css("border-color", "rgb(159,159,159)");
        $("#password").css("border-color", "rgb(159,159,159)");
        
        // Make sure username and password are not blank.
        if ( $("#username").val() == "" || $("#password").val() == "") {
           self.loginEmptyFields();
        }else {
            // Login using the authenticationService.
            var transaction = adobeDPS.authenticationService.login($("#username").val(), $("#password").val());
                transaction.completedSignal.addOnce(function(transaction) {
                var transactionStates = adobeDPS.transactionManager.transactionStates;
                if (transaction.state == transactionStates.FAILED) {
                    self.loginFail();
                } else if (transaction.state == transactionStates.FINISHED){
                    this.trigger("loginSuccess");
                    this.close();
                }
            }, this);
        }
    },
    loginEmptyFields: function(){
        var errorStr = "Please provide a"
        if ($("#username").val() == ""){
            $("#username").css("border-color", "rgb(255,0,0)");
            errorStr += " username";
            if ($("#password").val() == "") {
                errorStr += " and a";
            }
        }
            
        if ($("#password").val() == "") {
            $("#password").css("border-color", "rgb(255,0,0)");
            errorStr += " password"
        }

        errorStr += ".";
        $("#login .error").html(errorStr);
    },
    close: function() {
        this.$el.remove();
    },
    loginFail : function(){
        $("#login .error").html("Authentication Failed.")
    }, 
});