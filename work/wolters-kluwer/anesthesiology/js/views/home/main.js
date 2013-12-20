/* Main controller for our homepage */
define(['jquery',
        'underscore',
        'backbone',
        'collections/home',
        'views/home/footer',
        'views/base',
        'views/signin/main',

        'models/generic',
        'jqueryfastclick',
        ], 
function($,  _, Backbone, ViewCollection, FooterView, BaseView, LoginView, ViewModel,$fastclick){
    var appView = BaseView.extend(
    {
        /* Master DOM element */
        el                : $("#page_container"),

        /* Motion easing transition */
        jquery_speed      : 'slow',

        /* Tracks if the collection was already loaded */
        collection_loaded : false,

        gscope            : null,
        
        /* Because our home collection makes two
           web service calls, backbone will fire
           two reset events on the collection.  
           That means we need to track how many times 
           reset event was fired, because we only
           want to render our view once */
        renderCount     : 0,

        /* This is for testing, it doesn't have to always update
           just so long we have the ability to update to specific 
           versions for testing */
        version         : '1.1.9',

        /* When our router sees a change and instantiates
           this view, initialize is the first method that gets
           called.  Anything that we want to happen before
           the view is rendered happens here */
        initialize      : function()
        {
          window.addEventListener('load', function() {
              new FastClick(document.body);
          }, false);

          // handle network connection interruption
          window.addEventListener("offline", function(e) {
            promptNetworkChange(false);
          });

          // handle network connection interruption
          window.addEventListener("online", function(e) {
            promptNetworkChange(true);
          });

          this.loadCSS(['ui-darkness/jquery-ui-1.9.2.custom']);
          /* Bind event aggregator to listen for login state change */
          this.eventAggregator.bind("loginStateChange", this.onDPSLoaded);

          /* Determine if we already have loaded the collection */         
          (sessionStorage.getItem("HomeCollection") == null) ? this.collection_loaded = false : this.collection_loaded = true;
          
          /* If we already have data we don't need to do a fetch */
          if (this.collection_loaded == false)
          {
            this.collection = new ViewCollection();
            this.collection.bind("add", this.modelBind);
            this.collection.bind("reset", this.render, this);
            this.collection.bind("change", this.change, this)
            this.collection.fetch();   
            collection_loaded = true;
            //display the preloader
          }
          /* We need a reference to the global model for our non public members (ugh, backbone really?) */
          gscope = this.globalModel;
          /* We don't want to wait for our web service data to load
             to display the header and footer being those views
             are static and don't rely on web service data.  Create
             any DOM needed for these views */
          var html = "<div id='optional_image'>";
              html += "</div>"; 
              html += "<div id='body_container'>";
              html += "<div id='view_preloader_container'>";
              html += "<img src='"+this.globalModel.getEnvironment()+"images/preloader.gif' />";
              html += "</div>";
              html += "</div>";
              html += "<div id='footer_container'>";
              html += "</div>";

          this.$el.html(html);

          // always hide the sign in button on start up
          // if the user isn't logged in
          // we'll detect that and show the button if we need it
          $('#login_container').hide();
          
          this.footerView = new FooterView();
          this.footerView.setElement('#footer_container').render();

          /* If we already have data we don't need to do a fetch */
          if (this.collection_loaded == true)
          {
            // grab JSON from sessionStorage
            var s = sessionStorage.getItem('HomeCollection');
                s = JSON.parse(s);

            var issue_image_html = "<img src ='" + s[0].currentIssueObj.CoverURL + "' />";
            
            $('#issue_image').html(issue_image_html);
            $('#issue_information').text(s[0].currentIssueObj.IssueCitiationText);
            $('#issue_summary').text(s[0].Description);
            // add event listeners
            $('#toc_container').click(function() {
              window.location = "#/table_of_contents";
            });

            // add the data to the collection
            this.collection = new ViewCollection();
          
            var model = new ViewModel();
                model = s;

            this.collection.add(model);   
            
            // now we can render/update the view
            this.updateView();
          }
          
        },
        change          : function(){
          
        },
        modelBind       : function(model){
          
        },

        /* Gets called each time our collection has 
           completed a fetch. */
        render          : function()
        {
          if (sessionStorage.getItem('HomeCollection') == null)
          {
            var parsed = this.collection.toJSON();
            if (parsed.length > 0)
            {
              sessionStorage.setItem('HomeCollection',JSON.stringify(parsed));     
            }
          }
          this.renderCount++;
          if (this.renderCount >= 2)
          {
            var self = this;
            $('#view_preloader_container').fadeOut('slow', function() {
              self.updateView();
            });
          }
        },

        /* Now that we have web service data we
           can update the view accordingly */
        updateView      : function(){
          var html = "<div id='issue_image'></div>";
              html += "<div id='issue_details_container'>";
              html += "<div id='issue_information'></div>";
              html += "<div id='buy_issue_price_tag'></div>";
              html += "<div id='login_container'>";
              html += "<div id='login_button_or'>or</div>";
              html += "<div id='login_button'>Sign In</div>";
              html += "</div>";
              html += "<div id='buy_issue_button'></div>";
              html += "<div id='issue_summary'>";
              html += "</div>";
              html += "<div id='toc_container'>Table of Contents</div>";
              html += "</div>";
              html += "</div>";
              html += "<div id='version_container' style='margin-left: 15px;'><small>Version "+this.version+"</small></div>";
             
          $('#body_container').html(html);
          // always hide the login container on start up
          $('#login_container').hide();

          var data = this.collection.models[0];
          var issueObj = data.get('currentIssueObj');

          // save current article - we need this for toc
          gscope.setCurrentArticle(issueObj);

          var issue_image_html = "<img src ='" + issueObj.CoverURL + "' />";

          $('#issue_image').html(issue_image_html);
          $('#issue_information').text(issueObj.IssueCitiationText);
          $('#issue_summary').text(data.get('Description'));

          // add event listeners
          $('#toc_container').click(function() {
              window.location = "#/table_of_contents";
          });
          
          // now connect to DPS
          $(window).onadobedpscontextloaded = this.onDPSLoaded(); 
        },
        /* This method gets called when the application connects to
           the DPS system (or the local storeAPI.js when testing locally) */
        onDPSLoaded     : function(){
          // get the user info
          adobe.dps.store.getUserInfo(userInfoLoaded);
          // get the folio data
          adobe.dps.store.getFolioData(folioDataLoaded);

        },
      }, 
      /** 
        This method gets called once we have a callback
        for our user information request to DPS 
        @ data object containing user properties (authToken, userName)
      */
      userInfoLoaded  = function(data){
        var userObj = data;
        var token = userObj.authToken;
        var name = userObj.userName;
        /* Determine if the user is logged in or not */
        if (token == null || token.length == 0)
        {
          // user does not appear to be logged in
          $('#login_container').fadeIn($(this).jquery_speed);
          $('#login_button').click(function(){
            promptLogin();
          });
        }
        else
        {
          // user appears to be logged in ensure the login button is hidden
          $('#login_container').fadeOut($(this).jquery_speed);
        }
      },
      /** 
        This method gets called when we have loaded
        the users portfolio 
        @ returnedFolios list of folio objects returned from DPS
      */
      folioDataLoaded = function(returnedFolios){
        var hasMatch = false;
        var acc_num = gscope.getCurrentArticle().IssueAccessionNumber.replace (/-/gi, "");
    
        for (folio in returnedFolios)
        {
          // first check and see if we have a match
          if (returnedFolios[folio].productId == acc_num)
          {
            hasMatch = true; // flag the match

            sessionStorage.setItem("state", returnedFolios[folio].state);
            sessionStorage.setItem("price", returnedFolios[folio].price);
                
            var price = returnedFolios[folio].price;

            $("#buy_issue_price_tag").html(price);
                
            var state = returnedFolios[folio].state;

            makeSmartButton(state, $("#buy_issue_button"),  $("#buy_issue_button"), acc_num);

            // if the issue has a click action, make the cover image hot
            var view_folio_states = [100, 200, 400, 401, 1000, 1500];
            for (var j = 0; j <= view_folio_states.length; j ++){
              if (state == view_folio_states[j]){
                $('#issue_image').click(function() {
                  adobe.dps.store.viewFolio(acc_num);
                });
              }
            }
          }
        }
        if (hasMatch != true){
          $("#buy_issue_button").hide();
          $('#buy_issue_price_tag').hide();
          $('#login_container').hide();
        }
      },
      /**
          This method gets called when the user selected the 
          login button.  We are using jquery and jqueryui to handle
          the modal and the form validation and actions.  All
          supporting functions are inside this method.
      */
      promptLogin = function(){
        $('#container').append("<div id='dialog_container'></div>");
        this.loginView = new LoginView();
        this.loginView.setElement('#dialog_container').render();
      });
      
    return appView;
});