// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/global/header',
  'views/global/menu',
  'views/global/footer',
  'views/home/main',
  'views/dreams/main',
  'views/visions/main',
  'views/contact/main',
], function($, _, Backbone, HeaderView, MenuView, FooterView, HomeView, DreamsView, Visions, Contact) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'projects': 'showProjects',
      'users': 'showContributors',
      'dreams': 'showDreams',
      'visions': 'showVisions',
      'contact': 'showContact',
      
      // Default
      '*actions': 'defaultAction'
    }
  });
  
  var initialize = function(){

    var app_router = new AppRouter;

    // create the global header
    var headerView = new HeaderView();
        headerView.render();

    // create the global menu
    var menuView = new MenuView();
        menuView.render();

    // create the global footer
    var footerView = new FooterView();
        footerView.render();
    
    app_router.on('route:showProjects', function(){
   
        // Call render on the module we loaded in via the dependency array
        var projectsView = new ProjectsView();
        projectsView.render();

    });

    app_router.on('route:showDreams', function(){
   
        // Call render on the module we loaded in via the dependency array
        var dreamsView = new DreamsView();
        dreamsView.render();

    });

    app_router.on('route:showVisions', function(){
   
        // Call render on the module we loaded in via the dependency array
        var visions = new Visions();
            visions.render();

    });

    app_router.on('route:showContact', function(){
   
        // Call render on the module we loaded in via the dependency array
        var contact = new Contact();
            contact.render();

    });

    app_router.on('route:showContributors', function () {
    
        // Like above, call render but know that this view has nested sub views which 
        // handle loading and displaying data from the GitHub API  
        var contributorsView = new ContributorsView();
    });

    app_router.on('route:defaultAction', function (actions) {
        var homeView = new HomeView();
        homeView.render();
    });


    Backbone.history.start();

    var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-38098765-1']);
        _gaq.push(['_setDomainName', 'davecollierconsulting.com']);
        _gaq.push(['_trackPageview']);

    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  };
  return { 
    initialize: initialize
  };
});
