define(['views/global/header/main', 
        'views/global/menu/main'], 
function(GlobalHeader, GlobalMenu) 
{
        var Router = Backbone.Router.extend(
        {
            routes: 
            {
              ''                                : 'defaultAction',
              'table_of_contents'               : 'tocAction',
              'article_abstract/?:params'        : 'articleDetailsAction',
              'full_article/?:params'           : 'fullArticleAction',
              'featured'                        : 'featuredAction',
              'oa'                              : 'oaAction',
              'full_text_image/?:params'        : 'fullTextImageAction'
            }
        });

        // instantiate main router
        var app_router = new Router;
        var el = $("#container");

        var html = "<div id='view_container' class='view_current_issue'>";

            html += "<div id='header_container'>";
            html += "</div>";
            html += "<div id='menu_container'>";
            html += "</div>";
            html += "<div id='page_container'>";
            html += "</div>"; // end page_container
            html += "</div>"; // end view_current_issue

          // write containers to main container
          el.html(html);
        
        // at this point this is the first load so create the global containers
        var globalHeader = new GlobalHeader();
            globalHeader.setElement('#header_container').render();

        var globalMenu = new GlobalMenu();
            globalMenu.setElement('#menu_container').render();

        var article_abstract_view = null;

        /* default route */
        app_router.on('route:defaultAction', function (actions) 
        {
            $("#view_container").attr('class', 'view_current_issue');
            globalHeader.hideBackButton();
            require(['views/home/main'], function(HomeListView) 
            {
                var homeListView = new HomeListView();
            });
        });

        /* table of contents route */
        app_router.on('route:tocAction', function (actions) 
        {   
            $("#page_container").html('');
            $("#view_container").attr('class', 'view_toc');
            globalHeader.showBackButton();
            require(['views/toc/main'], function(TOCListView) 
            {
                var tocListView = new TOCListView();
                if(article_abstract_view !== null)
                {
                    article_abstract_view.removeInstance();
                    article_abstract_view = null;
                }
            });
        });

        /* article details route */
        app_router.on('route:articleDetailsAction', function (actions) 
        {
            $("#page_container").html('');
            $("#view_container").attr('class', 'view_article_abstract');
            globalHeader.showBackButton();
            require(['views/article_abstract/main'], function(ArticleDetailsListView) 
            {
                var articleDetailsListView = new ArticleDetailsListView();
                    // there is no collection for this view so we need to manually call render();
                    articleDetailsListView.render();
                    article_abstract_view = articleDetailsListView;
            });
        });

        /* article details route */
        app_router.on('route:fullArticleAction', function (actions) 
        {
            $("#page_container").html('');
            $("#view_container").attr('class', 'view_full_text');
            globalHeader.showBackButton();
            require(['views/full_article/main'], function(FullArticleView) 
            {
                var fullArticleView = new FullArticleView();
                    fullArticleView.render();
            });
        });

        /* featured */
        app_router.on('route:featuredAction', function (actions) 
        {
            $("#page_container").html('');
            $("#view_container").attr('class', 'view_featured');
            globalHeader.hideBackButton();
            require(['views/featured/main'], function(FeaturedView) 
            {
                var featuredView = new FeaturedView();
            });
        });

        /* Open Access */
        app_router.on('route:oaAction', function (actions) 
        {
            $("#page_container").html('');
            $("#view_container").attr('class', 'view_oa');
            globalHeader.hideBackButton();
            require(['views/oa/main'], function(OAView) 
            {
                var oaView = new OAView();
            });
        });

        /* Full Image */
        app_router.on('route:fullTextImageAction', function (actions) 
        {
            $("#page_container").html('');
            $("#view_container").attr('class', 'view_full_image');
            globalHeader.showBackButton();
            require(['views/full_text_image/main'], function(FullTextImageView) 
            {
                var fullTextImageView = new FullTextImageView();
            });
        });


        Backbone.history.start();
    });