/* The abstract */
define(['jquery',
        'jquerymove',
        'jqueryswipe',
        'underscore',
        'backbone',
        'views/base',
        'models/global',
        'fullText', // journal js file
        'toolTip', // journal js file
        'imageWrapperControl',
        'views/signin/main',
        'swipeview',
        ],
function($, $move, $swipe, _, Backbone, BaseView, GlobalData, FullText, ToolTip, ImageWrapperControl, LoginView, s)
{
  var appView = BaseView.extend(
  {
    /* Master DOM element */
    el              : $("#page_container"),
    
    initialize      : function(){
        /* Bind event aggregator to listen for login state change */
        this.eventAggregator.bind("loginStateChange", this.onDPSLoaded);

        var html = "<div class='horizontalPageContainer' id='horizontalPageContainer'>"
            html += "<div id='wrapper'>";
            html += "<div id='content' class='img_slides_wrap slides_wrap wrap'>";
            html += "<div id='view_preloader_container' style='margin-left: 10px;margin-top: 10px;'>";
            html += "<img src='"+this.globalModel.getEnvironment()+"images/preloader.gif' />";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            this.$el.html(html);
    },

    render          : function(){
      $('#view_preloader_container').remove();
      var query_string = {};
      var query = window.location.href;
      var vars = query.split("&");
      
      for (var i = 0; i < vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
          query_string[pair[0]] = pair[1];
          // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
          var arr = [ query_string[pair[0]], pair[1] ];
          query_string[pair[0]] = arr;
          // If third or later entry with this name
        } else {
          query_string[pair[0]].push(pair[1]);
        }
      } 

      list = query_string.list;
      index = query_string.index;

      var list_results = sessionStorage.getItem(list);
          list_results = JSON.parse(list_results);
        
      articles = list_results;
      
        var gallery,
            el,
            i,
            page,
            fauxIndex = (index == 0) ? articles.length - 1: index - 1 ,
            dots = document.querySelectorAll('#nav li'),
            slides = articles;

        /* Register a listener to wrapper for page changes */
        $('#wrapper').on('next', function() {
          if (fauxIndex == articles.length - 1){
            fauxIndex = 0
          }else{
            fauxIndex ++;  
          }
        });

        $('#wrapper').on('prev', function() {
          if (fauxIndex <= 1){
            fauxIndex = articles.length;
          }else{
            fauxIndex --;
          }
        });

        gallery = new SwipeView('#wrapper', { numberOfPages: slides.length });
         
        for (i=0; i<3; i++) {
          el = document.createElement('div');
          el.id = 'page_'+i;
          el.className = 'page';
          el.innerHTML = this.getPageMarkUp(fauxIndex, this);
          gallery.masterPages[i].appendChild(el);
          this.bindAssets(fauxIndex, this, articles);
          if (fauxIndex == articles.length - 1){
            fauxIndex = 0
          }else{
            fauxIndex ++;  
          }
        }

        var self = this;
        gallery.onFlip(function () {
          var el,
              upcoming,
              i;
              
          for (i=0; i<3; i++) {
            upcoming = gallery.masterPages[i].dataset.upcomingPageIndex;
            var next = Number(upcoming) + 1;

            if (upcoming != gallery.masterPages[i].dataset.pageIndex) {
              el = gallery.masterPages[i].querySelector('div');
              el.innerHTML = self.getPageMarkUp(fauxIndex, self, articles);
              self.bindAssets(fauxIndex, self, articles);

            }

          }
        });

        gallery.onMoveOut(function () {
          gallery.masterPages[gallery.currentMasterPage].className = gallery.masterPages[gallery.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
        });

        gallery.onMoveIn(function () {
          var className = gallery.masterPages[gallery.currentMasterPage].className;
          /(^|\s)swipeview-active(\s|$)/.test(className) || (gallery.masterPages[gallery.currentMasterPage].className = !className ? 'swipeview-active' : className + ' swipeview-active');
        });

    },
    getPageMarkUp : function(_position, _scope){
      var label = "<b>Abstract:</b>";
      var content = articles[_position].Abstract.replace('<![CDATA[', '');
          content = content.replace(']]>', '');
                
      var abtract_text;

      if (content.length > 0){
        content = content.replace("Introduction:", "<br/>Introduction:");
        content = content.replace("Background:", "<br/>Background:");
        content = content.replace("Methods:", "<br/><br/>Methods:");
        content = content.replace("Results:", "<br/><br/>Results:")
        content = content.replace("Conclusions:", "<br/><br/>Conclusions:")
        abtract_text = label + content;
      }
      else
      {
        abtract_text = "An abstract is unavailable";
      }

      var authors = articles[_position].FormattedAuthors;
          authors = authors.split(';');

      var authorDOM;
                
      if (authors.length > 3)
      {
        authorDOM = "<a style='color: #5a5a5a;text-decoration: none;' onclick=\"javascript:showReference(this, '"+articles[_position].UnFormattedAuthors+"')\">"+articles[_position].FormattedAuthors+"</a>";
      }
      else
      {
        authorDOM = articles[_position].FormattedAuthors;
      }

      
      var html = "<div id='section_title_header_container'>";
          html += "<div id='section_title_header_label'>";
          html += articles[_position].Section;
          html += "</div>"; // end section_title_header_label
          html += "</div>"; // end section_title_header_container
          html += "<div id='issue_container'>";
          html += "<div id='issue_image_"+_position+"' class='issue_image'>";
          html += "</div>" // end issue_image
          html += "<div id='issue_details_container'>";
          html += "<div id='issue_title'>";
          html += articles[_position].Title.truncate();
          html += "</div>";
          html += "<div id='author_label'>"+authorDOM+"</div>";
          
          if (articles[_position].IsCME == true)
          {
            html += "<div id='article_links_button'>";
            html += "<img src='"+_scope.globalModel.getEnvironment()+"images/icon-cme.jpg' />";
            html += "</div>";
          }
          if (articles[_position].IsOpenAccess == true)
          {
            html += "<div id='article_links_button'>";
            html += "<img src='"+_scope.globalModel.getEnvironment()+"images/icon-open.gif' />";
            html += "</div>";
          }
          if (articles[_position].IsPAP)
          {
            html += "<div id='article_links_button'>";
            html += "<img src='"+_scope.globalModel.getEnvironment()+"'images/icon-indicator-pap.png' />";
            html += "</div>";
          }
          if (articles[_position].IsSDC == true)
          {
            html += "<div id='article_links_button'>";
            html += "<img src='"+_scope.globalModel.getEnvironment()+"images/icon-sdc.gif'>";
            html += "</div>";
          }

          html +="</div>"; // end issue_details_container
          html +="<div class='clearfix'>&nbsp;</div>";
          html += "</div>";
          html += "</div>";
          html += "<div class='clearfix'>&nbsp;</div>";
          html += "<div id='article_detail_container'>";
          html += "<div class='verticalScrollContainer' id='verticalScrollContainer_"+_position+"' style='height:425px;'>";
          html += "<div id='content_"+_position+"'>"+abtract_text+"</div>";
          html += "</div>";
          html += "</div>";
          html += "<div class='clearfix'>&nbsp;</div>";
          html += "<div id='issue_purchase_container'>";
          html += "<div id='citation_label_"+_position+"' class='citation_label'>";
          html += articles[_position].IssueCitationText;
          html += "</div>";
          html += "<div id='price_label_"+_position+"' class='price_label'>";
          html += "</div>";
          html += "<div id='buy_issue_button' class='buy_issue_button_"+_position+"'>";
          html += "</div>";
          html += "<div id='login_container' class='login_container_"+_position+"'>";
          html += "<div id='login_button_or'>";
          html += "or";
          html += "</div>";
          html += "<div id='login_button_"+_position+"' class='login_button'>";
          html += "Sign In";
          html += "</div>";
          html += "</div>";
          html += "<div id='stateDebug_"+_position+"'>";
          html += "</div>";
          html += "</div>";
          html += "</div>";
          html += "</div>";
          
      return html;
    },
    bindAssets     : function(_position, _scope, _articles){
      var articles = _articles;
      // hide the sign in button
      $('.login_container_'+_position).hide();
      $('#issue_image_'+_position).html('<img src="'+articles[_position].ArticleImageUrl+'" />');
      $(window).onadobedpscontextloaded = onDPSLoaded(); 
                      
      function onDPSLoaded()
      {
        adobe.dps.store.getFolioData(folioDataLoaded);
      }
            
      function folioDataLoaded(returnedFolios){
        storeFolios = returnedFolios;
        
        var citation_label = $('#citation_label_'+_position);
        var price_label = $('#price_label_'+_position);
        var artAcc = articles[_position].ArticleAccessionNumber.replace (/-/gi, "");
                  
        var issueAcc = artAcc.substr(0, artAcc.length-5)
            issueAcc += "00000";

        var state = 0;
        var price = 0;
        var arr = [];
        var hasMatch = false;
        
        for (var j = 0; j < storeFolios.length; j++)
        {
          arr.push(storeFolios[j].productId);    
          if (storeFolios[j].productId == issueAcc)
          {
            hasMatch = true;
            state = storeFolios[j].state;
            price = storeFolios[j].price;
          }
        }

        var stateDebug = $('#stateDebug_'+_position);
        //stateDebug.html('state: '+ state);
        price_label.html(price);
        citation_label.html(articles[_position].IssueCitationText);  
        makeSmartButton(state, $(".buy_issue_button_"+_position),  $(".buy_issue_button_"+_position), issueAcc);
        adobe.dps.store.getUserInfo(checkLoginStatus);

        if (hasMatch != true){
          $(".buy_issue_button_"+_position).hide();
          price_label.hide();
          $('.login_container_'+_position).hide();
        }
      }

      function checkLoginStatus(data){
        var userObj = data;
        var token = userObj.authToken;
        var name = userObj.userName;
        var sign_in_button = $('.login_container_'+_position)
        if (token == null || token.length == 0)
        {
          for (i=0; i<3; i++) {
            $('.login_container_'+i).fadeIn('slow');
          }
          //sign_in_button.show();
          $("#login_button_"+_position).click(function(){
            $('#container').append("<div id='dialog'></div>");
            this.loginView = new LoginView();
            this.loginView.setElement("#dialog").render();
          });
        }
        else
        {
          for (i=0; i<3; i++) {
            $('.login_container_'+i).fadeOut('slow');
          }
        }
      }
    },
    removeInstance : function(){
            // clean up goes here
    }

  });
  return appView;
})