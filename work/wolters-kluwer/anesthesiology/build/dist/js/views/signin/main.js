define(["jquery","jqueryui","underscore","backbone","views/base"],function(e,t,n,r,i){var s=i.extend({el:e("#dialog_container"),sign_in_url:"",initialize:function(){this.loadCSS(["login"]),this.loadCSS(["ui-darkness/jquery-ui-1.9.2.custom"]),this.sign_in_url=this.globalModel.sign_in_with_credentials},change:function(){},modelBind:function(e){},render:function(){function f(e){a.text(e).addClass("ui-state-highlight"),setTimeout(function(){a.removeClass("ui-state-highlight",1500)},500)}function l(e,t,n,r){return e.val().length>r||e.val().length<n?(e.addClass("ui-state-error"),f("Please provide a "+t+"."),!1):!0}function c(e,t,n){return t.test(e.val())?!0:(e.addClass("ui-state-error"),f(n),!1)}var t=this.eventAggregator,n=this.sign_in_url,r=this,i="<div id='dialog'>";i+="<div class = 'view_signin'>",i+='<p class="validateTips">Please sign into your account</p>',i+="<form>",i+="<fieldset>",i+='<input type="text" name="name" id="name" value="Username" onkeydown="if(this.value==\'Username\'){this.value=\'\';}" onblur="if(this.value==\'\') this.value=\'Username\';" class="text ui-widget-content ui-corner-all" />',i+='<input value="Password" name="password" id="password"  onkeydown="if(this.type!=\'password\'){this.type=\'password\';this.value=\'\';}" onblur="if(this.value==\'\') this.value=\'Password\';" class="text ui-widget-content ui-corner-all">',i+="</fieldset>",i+="</form>",i+="</div>",i+='<div id="forgot_password"><a href="'+this.globalModel.forgot_password_url+'" target="_blank"><p>Forgot Password?</p></a></div>',i+='<div id="register_account"><a href="'+this.globalModel.register_account_url+'" target="_blank"><p>Create an Account</p></a></div>',i+="</div>",this.$el.html(i);var s=e("#name"),o=e("#password"),u=e([]).add(s).add(o),a=e(".validateTips");e("#dialog").dialog({title:"Sign In",modal:!0,resizable:!0,width:400,height:335,draggable:!0,show:"fade",hide:"fade",dialogClass:"main-dialog-class",buttons:{"Sign In":function(){var r=!0;u.removeClass("ui-state-error"),r=r&&l(s,"username",0,20),r=r&&l(o,"password",0,20),r&&(e("#users tbody").append("<tr><td>"+s.val()+"</td>"+"<td>"+o.val()+"</td>"+"</tr>"),getAuthToken(s.val(),o.val(),t,n))},Cancel:function(){e(this).dialog("close")}},close:function(){}})}},getAuthToken=function(t,n,r,i){var s=t,o=n,u=i;u=u.replace("{username}",s),u=u.replace("{password}",o),e.ajaxSetup({error:function(t,n,r,i){switch(t.status){case 401:var s=e(".validateTips");s.text("Invalid credentials").addClass("ui-state-highlight")}}}),e.ajax({url:u}).done(function(t){var n=e(t).find("result").attr("httpResponseCode");if(n=="200"){var i=e(t).find("authToken").text();adobe.dps.store.setUserInfo(i,s),e("#dialog").dialog("close"),r.trigger("loginStateChange")}})});return s});