var libraryView;
var AppRouter = Backbone.Router.extend({ 
    routes: { 
        "": "defaultRoute",
        "debug" : "debug",
        //"signin": "signin",
        "library-detail-view/?:params" : "libraryDetailView",
        //"library-detail-view" : "libraryDetailView",
        "remove-folios-view" : "removeFoliosView",
    },
    // store the last route 
    lastRoute : "defaultRoute",
    // default behavior
    defaultRoute: function() {
        libraryView =  new LibraryView;    
        this.lastRoute = "defaultRoute";
    },
    // sign in module
    signin: function () {
        // don't assign since it's a model
        var loginView = new LoginView();
            loginView.initialize;

    },
    debug: function() {
        if (this.lastRoute != "debug") {
            libraryView.displayDebug();
        }
        this.lastRoute = "debug";
    },
    libraryDetailView: function(s) {
        
        var libraryDetailView = new LibraryDetailView();
            //libraryDetailView.initialize();
        
        this.lastRoute = "library-detail-view";  
    },
    removeFoliosView: function(s) {
        
        var removeFoliosView = new RemoveFoliosView();
            //removeFoliosView.initialize();
    }
}); 