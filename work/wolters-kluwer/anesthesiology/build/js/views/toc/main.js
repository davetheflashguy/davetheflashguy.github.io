define(['jquery',
        'underscore',
        'backbone',
        'collections/toc',
        'views/base',
        'views/signin/main',
        'models/generic',
        ],
function($, _, Backbone, ViewCollection, BaseView, LoginView, ViewModel)
{
    var tocListView = BaseView.extend(
    {
        /* Master DOM element */
        el              : $("#page_container"),

        /* Motion easing transition */
        jquery_speed    : 'slow', 

        /* Tracks if the collection was already loaded */
        collection_loaded : false,

        gscope            : null,


        /* When our router sees a change and instantiates
           this view, initialize is the first method that gets
           called.  Anything that we want to happen before
           the view is rendered happens here */
        initialize      : function()
        {

          /* We don't want to wait for our web service data to load
             to display the header and footer being those views
             are static and don't rely on web service data.  Create
             any DOM needed for these views */
          var html = "<div id='issue_container'>";
              html += "<div id='issue_image'><img src='"+ this.globalModel.getCurrentArticle().CoverURL + "' /></div>";
              html += "<div id='issue_details_container'>";
              html += "<div id='issue_title'>"+this.globalModel.getCurrentArticle().IssueCitiationText+"</div>";
              html += "<div id='buy_issue_price_tag'></div>";
              html += "<div id='login_container'>";
              html += "<div id='login_button_or'>or</div>";
              html += "<div id='login_button'>Sign In</div>";
              html += "</div>";
              html += "<div id='buy_issue_button'></div>";
              html += "</div>";
              html += "<div>";
              html += "</div>";
              html += "</div>";
              html += "<div class='clearfix'>&nbsp;</div>";
              html += "<div id='page'>";
              html += "<div id='body_container'>";
              html += "</div>";
              html += "</div>";
          
          this.$el.html(html);

          this.eventAggregator.bind("loginStateChange", this.onDPSLoaded);
          
          (sessionStorage.getItem("TOCArticleList") == null) ? this.collection_loaded = false : this.collection_loaded = true;

          if (this.collection_loaded == false)
          {
            this.collection = new ViewCollection();
            this.collection.bind("add", this.modelBind);
            this.collection.bind("reset", this.render, this);
            this.collection.fetch();
            // add preloader
            html = "<div id='view_preloader_container' style='margin-left: 10px;margin-top: 10px;'>";
            html += "<img src='"+this.globalModel.getEnvironment()+"images/preloader.gif' />";
            html += "</div>";  
            $('#body_container').html(html);
          }


          
          // always hide the sign in button on start up
          // if the user isn't logged in
          // we'll detect that and show the button if we need it
          $('#login_container').hide();
          var internalScope = this;
          if (this.collection_loaded == true)
          {
            // first remove the preloader
            $('#view_preloader_container').fadeOut('slow');
            // then call the render function
            setTimeout(function(){
              internalScope.render();
            },250);
          }
          $(window).onadobedpscontextloaded = this.onDPSLoadedFolioData();
          $(window).onadobedpscontextloaded = this.onDPSLoadedUserInfo();
        },
        modelBind         : function(model)
        {
          
        },
        /* Gets called each time our collection has 
           completed a fetch. */
        render            : function()
        {
            $('#view_preloader_container').remove();
            if (this.collection_loaded == true)
            {
              var list =sessionStorage.getItem('TOCArticleList');
              list = JSON.parse(list);

              /* this is pretty cool */
              this.collection = new ViewCollection();

              for (j = 0; j < list.length; j++)
              {              
                var oaModel = new ViewModel();
                    oaModel = list[j];

                this.collection.add(oaModel);    
              }
            }
            else
            {
              var parsed = this.collection.toJSON();
              if (parsed.length > 0)
              {
                  if (sessionStorage.getItem('TOCArticleList') == null)
                  {
                    sessionStorage.setItem('TOCArticleList',JSON.stringify(parsed));     
                  }
              }
            }  
          
          var counter = 0;
          var lastSection;
          var nextSection;
          var html = "";

          for (var i =0; i < this.collection.models.length; i ++)
          {
            var article = this.collection.models[i];
            if (article.get("Section") != lastSection)
            {
              html += "<div id='section_title_header_container'>";
              html += "<div id='section_title_header_label'>" + article.get("Section") + "</div>";
              html += "</div>";
            }

            html += "<div id='article_container_"+i+"' class = 'article_container'>"; 
            html += "<div id='section_title'>";
            html += article.get("Title").truncate()+"<br/>";
            html += "</div>";
            html += "<div id = 'author_label'>" + article.get("FormattedAuthors") + "</div>";
                
            html += "<div id='article_links_container'>";
            if (article.get("IsCME") == true)
            {
              html += "<div id='article_links_button'>";
              html += "<img src='"+this.globalModel.getEnvironment()+"images/icon-cme.jpg' />";
              html += "</div>";    
            }
            if (article.get("IsOpenAccess") == true)
            {
              html += "<div id='article_links_button'>";
              html += "<img src='"+this.globalModel.getEnvironment()+"images/icon-open.gif' />";
              html += "</div>";
            }
            if (article.get("IsPAP") == true)
            {
              html += "<div id='article_links_button'>";
              html += "<img src='"+this.globalModel.getEnvironment()+"'images/icon-indicator-pap.png' />";
              html += "</div>";
            }
            if (article.get("IsSDC") == true)
            {
              html += "<div id='article_links_button'>";
              html += "<img src='"+this.globalModel.getEnvironment()+"images/icon-sdc.gif'>";
              html += "</div>";
            }
            
            html += "</div>";
            html += "<div class='clearfix'>&nbsp;</div>";
            html += "</div>";

            lastSection = article.get("Section");
                
            if (i < this.collection.models.length - 1)
            {
              counter ++;
              var nextSection = this.collection.models[counter].get("Section");
              if (nextSection == lastSection)
              {
                html += "<hr>";
              }
            }
          }
          
          $("#body_container").append(html);
          
          for (var i =0; i <= this.collection.models.length; i ++)
          {
            $('#article_container_'+i).click(function() {
                
            var x = this.id;

            var id = this.id;
                id = id.substr(id.lastIndexOf('_') + 1, id.length);
                
            sessionStorage.setItem("selected_article", id);
            sessionStorage.setItem("selected_section", article.get("Section"));
                
            window.location = "#/article_abstract/?articleAccessionNumber="+article.get("ArticleAccessionNumber")+"&list=TOCArticleList&index="+id

            });
          }

          
        },
        /* This method gets called when the application connects to
           the DPS system (or the local storeAPI.js when testing locally) */
        onDPSLoadedUserInfo     : function(){
          // get the folio data
          adobe.dps.store.getUserInfo(userInfoLoaded);
        },        
        onDPSLoadedFolioData    : function(){
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
          hasMatch = true; // flag the match

          // first check and see if we have a match
          if (returnedFolios[folio].productId == acc_num)
          {
            sessionStorage.setItem("state", returnedFolios[folio].state);
            sessionStorage.setItem("price", returnedFolios[folio].price);
                
            var price = returnedFolios[folio].price;
            $("#buy_issue_price_tag").html(price);
                
            var state = returnedFolios[folio].state;

            makeSmartButton(state, $("#buy_issue_button"),  $("#buy_issue_button"), acc_num);
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
    return tocListView;
});