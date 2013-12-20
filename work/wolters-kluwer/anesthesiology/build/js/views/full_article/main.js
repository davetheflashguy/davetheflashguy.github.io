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
    
    el              : $("#page_container"),

    userToken       : '3F5FCB93-EBB5-49f3-8952-7F6E4CF392B7',

    pdf_by_accession_number_and_user_token : null,

    issueAccessionNumber : null,

    view_web_service_url : null,

    verticalScrollContainer : null,

    position : 0,
    initialize      : function(){
        var html = "<div id='wrapper'>";
            html += "<div id='view_preloader_container' style='margin-left: 10px;margin-top: 10px;'>";
            html += "<img src='"+this.globalModel.getEnvironment()+"images/preloader.gif' />";
            html += "</div>";
            html += "</div>";
            
        this.$el.html(html);
    },

    render          : function(){
      var query_string = {};
      var query = window.location.href;
                  
      var first = [];
          first = query.split("?");
          first = first[1];
          first = first.split("&");
          first = first[0].substr(23,first[0].length)
                      
      var vars = query.split("&");
      
      for (var i=0; i < vars.length; i++) 
      {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined")
        {
          query_string[pair[0]] = pair[1];
        } 
        else if (typeof query_string[pair[0]] === "string") 
        {
          var arr = [query_string[pair[0]],pair[1]];
          query_string[pair[0]] = arr;
        } 
        else 
        {
          query_string[pair[0]].push(pair[1]);
        } 
      }
    
      var articleAccessionNumber = first;
      pdf_by_accession_number_and_user_token = this.globalModel.pdf_by_accession_number_and_user_token;

      var url = this.globalModel.full_text_by_accession_number;
          url = url.replace('{accessionNumber}', articleAccessionNumber);
                
      this.view_web_service_url = url;

      var list = sessionStorage.getItem(query_string.list);


      var index = query_string.index;
      var list_results = JSON.parse(list);
  
      articles = list_results;
      
      userToken = this.userToken;

      var self = this;
      $(window).onadobedpscontextloaded =  adobe.dps.store.getUserInfo(checkLoginStatus);
      function checkLoginStatus(data){
        var userObj = data;
        var token = userObj.authToken;
      
        if (token.length){
           userToken = token;
        }
      }

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
          this.getPageMarkUp(fauxIndex, this, el, gallery.masterPages[i]);
          //this.bindAssets(fauxIndex, this, articles);
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
              self.getPageMarkUp(fauxIndex, self, el);
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
    getPageMarkUp : function(_position, _scope, _el, _gallery){

      var self = this;
      this.position = _position;
      / * First ajax call gets the page contents */
      var uri = this.view_web_service_url.replace(/(accessionnumber=)[^\&]+/, '$1' + articles[_position].ArticleAccessionNumber);
      $.ajax({
        url: uri, async: true,
      }).done(function(data) {
        var DOM = "<div id='verticalScrollContainer"+_position+"' class='verticalScrollContainer' style='height:1024px; overflow:auto'>";
            DOM += "<div id='vContent"+_position+"'>";
            DOM + "<div id='contentContainer"+_position+"'>";

            var full_text_data = $(data).find('ArticleFullTextHTML').text();
                full_text_data = full_text_data.replace('<![CDATA[', '');
                full_text_data = full_text_data.replace(']]>', '');

            DOM += full_text_data;

            DOM += "</div>";
            DOM += "<canvas id='scrollIndicator_"+_position+"' class='scrollIndicator'></canvas>";
            DOM += "</div>";
            DOM += "</div>";
            
        if (full_text_data.length > 0){
          _el.innerHTML =  DOM;
        }else{
          var pdf_service = pdf_by_accession_number_and_user_token;
              pdf_service = pdf_service.replace("{AccessionNumber}", articles[_position].ArticleAccessionNumber);
              pdf_service = pdf_service.replace("{UserToken}", self.userToken);
          $.ajax({
            url: pdf_service, async: false,
          }).done(function(data) {     
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
            var authors = articles[_position].Authors;
                authors = authors.split(';');

            var authorDOM;
                      
            if (authors.length > 3)
            {
              authorDOM = "<a style='color: #5a5a5a;text-decoration: none;' onclick=\"javascript:showReference(this, '"+articles[_position].UnFormattedAuthors+"')\">"+articles[_position].FormattedAuthors+"</a>";
            }
            else
            {
              authorDOM = articles[_position].Authors;
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
                var articleHTML = "";
                $(data).find('PdfURL').each(function () {
                      articleHTML += "<div class='view_pdf_container'><p>This article is available in PDF only.</p><br/>";
                      articleHTML += "<a href='"+$(this).text()+"'><div id='buy_issue_button'>View PDF</div></a></div>";
                });       

               html += articleHTML+"<div id='abstract'>"+abtract_text+"</div></div></div><div class='clearfix'>&nbsp;</div></div></div></div>";
               
              _el.innerHTML = html;
          });
        }

        if (_gallery)
        _gallery.appendChild(_el);

        // we don't like these guys, these guys break us
        // disable the href property of links coming back from the APi
        // this way we can keep the external javascript tool tip call
        
        $('sup a').each(function () {
            $('sup a').attr('href', '#_');
        });

        $('#view_preloader_container').remove();
      });
    },
    removeInstance : function(){
            // clean up goes here
    }
  });
  return appView;
})