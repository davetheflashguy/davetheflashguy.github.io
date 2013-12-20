/* Main controller the featured view */
define(['jquery',
        'underscore',
        'backbone',
        'collections/featured',
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
        initialize      : function()
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

          (sessionStorage.getItem("FeaturedArticleList") == null) ? this.collection_loaded = false : this.collection_loaded = true;
          
          if (this.collection_loaded == false){
            this.collection = new ViewCollection();
            this.collection.bind("add", this.modelBind);
            this.collection.bind("reset", this.render, this);
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
              var list =sessionStorage.getItem('FeaturedArticleList');
              list = JSON.parse(list);

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
                  if (sessionStorage.getItem('FeaturedArticleList') == null)
                  {
                    sessionStorage.setItem('FeaturedArticleList',JSON.stringify(parsed));     
                  }
              }
            }
            
            var html = "";
            for (var i = 0; i < this.collection.models.length; ++i) {
              var article = this.collection.models[i];
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
              html += "<div id='author_label'>" + article.get("FormattedAuthors");
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
              html += "</div>";

                        
              if (i < this.collection.models.length - 1)
              {
                
                html += "<hr>";  
              }
            
            }

          $("#body_container").append(html);

          for (var i =0; i < this.collection.models.length; i ++)
          {
              $('#article_container_'+i).click(function() {
                $("#body_container").remove();
                var x = this.id;

                var id = this.id;
                    id = id.substr(id.lastIndexOf('_') + 1, id.length);
                
                sessionStorage.setItem("selected_article", id);
                sessionStorage.setItem("selected_citation", article.get("IssueCitationText"));

                window.location = "#/article_abstract/?articleAccessionNumber="+article.get("ArticleAccessionNumber")+"&list=FeaturedArticleList&index="+id
                });
          }
        },
        
        checkNetworkStatus : function(){

        }
      });
    return appView;
});