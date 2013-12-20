/* Main controller for our open access section */
define(['jquery',
        'underscore',
        'backbone',
        'collections/oa',
        'views/base',
        'models/generic'], 
function($, _, Backbone, ViewCollection, BaseView, ViewModel)
{
    var appView = BaseView.extend(
    {
        /* Master DOM element */
        el              : $("#page_container"),
        
        /* Tracks if the collection was already loaded */
        collection_loaded : false,

        /* When our router sees a change and instantiates
           this view, initialize is the first method that gets
           called.  Anything that we want to happen before
           the view is rendered happens here */
        initialize: function()
        {
  
          /* We don't want to wait for our web service data to load
             to display the header and footer being those views
             are static and don't rely on web service data.  Create
             any DOM needed for these views */
          var html = "<div id='page'>";
              html += "<div id='body_container'>";
              html += "</div>";
              html += "</div>";
          
          this.$el.html(html);

          (sessionStorage.getItem("OpenAccessArticleList") == null) ? this.collection_loaded = false : this.collection_loaded = true;

          if (this.collection_loaded == false)
          {
            this.collection = new ViewCollection();
            this.collection.bind("add", this.modelBind);
            this.collection.bind("reset", this.render, this);
            this.collection.bind("change", this.change, this)
            this.collection.fetch();
            collection_loaded = true;
            // add preloader
            html = "<div id='view_preloader_container'>";
            html += "<img src='"+this.globalModel.getEnvironment()+"images/preloader.gif' />";
            html += "</div>";  
            $('#body_container').html(html);
          }

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
        },
        change          : function(){
          
        },
        modelBind       : function(model){
          
        },
        /* Gets called each time our collection has 
           completed a fetch. */
        render: function()
        {
          $('#view_preloader_container').remove();
          if (this.collection_loaded == true)
          {
            var list =sessionStorage.getItem('OpenAccessArticleList');
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
              if (sessionStorage.getItem('OpenAccessArticleList') == null)
              {
                sessionStorage.setItem('OpenAccessArticleList',JSON.stringify(parsed));     
              }
            }
          }
          
          var html = "";
          var counter = 0;
          for (var i = 0; i < this.collection.models.length; ++i) {
              var article = this.collection.models[i];

              if (article.get('IssueCitationText') != this.lastCitationText) {
                  html += "<div id='section_title_header_container'>";
                  html += "<div id='section_title_header_label'>" + article.get('IssueCitationText');
                  html += "</div>";
                  html += "</div> ";
              }

              html += "<div id='article_container_"+i+"' class='article_container'>"; 
              html += "<div id='thumb_container'>";
              if (article.get("ArticleImageUrl"))
              {
                html += "<img src='"+article.get("ArticleImageUrl")+"' />";  
              }
              html += "</div>";
              html += "<div id='article_details_container'>";
              html += "<div id='article_title'>" + article.get("Title").truncate();
              html += "</div>";
              html += "<div id='author_label'>" + article.get("Authors");
              html += "</div>";
             
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
              html += "</div> "; //  close issue container
              this.lastCitationText = article.get('IssueCitationText');
              if (i < this.collection.models.length - 1)
              {
                counter ++;
                var nextCitationText = this.collection.models[counter].get("IssueCitationText");
                if (nextCitationText == this.lastCitationText)
                {
                  html += "<hr>";
                }
              }
          }
          //html += "</div>"; 
          $("#body_container").append(html);
         
          for (var i =0; i < this.collection.models.length; i ++)
          {
            article = this.collection.models[i];
            var collection = this.collection;
            
            $('#article_container_'+i).click(function(e) 
            {

              /* 
                Fixes bug # 275551 - Selecting TOC Section Title redirects to article
                Make sure when the user selects a label (if applicable), we don't redirect
                the user to the full text view */
              
              if (e.target.id !== "section_title_header_label" && e.target.id !== "section_title_header_container")
              {
                $("#body_container").remove();
                var id = this.id;
                    id = id.substr(id.lastIndexOf('_') + 1, id.length);
                  
                window.location = "#/full_article/?articleAccessionNumber="+collection.models[id].get("ArticleAccessionNumber")+"&list=OpenAccessArticleList&index="+id;  
              }     
            });
          }
        }
      });
    return appView;
});