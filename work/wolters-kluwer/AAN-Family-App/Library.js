// ---------------
// The Library Page
// ---------------

// Library Model
// ---------------
var LibraryModel = Backbone.Model.extend({
    // Default attributes for the Library
    defaults: function() {
        return {
            /* Default model attributes */  
        };
    },
});

// Library Collection
// ---------------
var LibraryCollection = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: LibraryModel,
    // callback from backbone's collection
    parse: function(xml) {
        var issueNodes = xml.getElementsByTagName("issue");
        var len = issueNodes.length;
        if (len > 0) {
            var issues = [];
            for (var i = 0; i < len; i++) {
                var issueNode = issueNodes[i];
                // Get the attributes
                var issue = {};
                var attributes = issueNode.attributes;
                issue.id = attributes.getNamedItem("id").value;
                issue.productId = attributes.getNamedItem("productId").value;
                issue.formatVersion = attributes.getNamedItem("formatVersion").value;
                issue.version = attributes.getNamedItem("version").value;
                issue.subpath = attributes.getNamedItem("subpath").value;
                
                // Loop through the nodes.
                var childNodes = issueNode.childNodes;
                var numNodes = childNodes.length;
                for (var j = 0; j < numNodes; j++) {
                    var childNode = childNodes[j];
                    if (childNode.nodeType == 1) {
                        var nodeName = childNode.nodeName;
                        if (nodeName == "libraryPreviewUrl") {
                            issue[nodeName] = $.trim(childNode.firstChild.nodeValue);
                        } else if (childNode.nodeName == "publicationDate") {
                            // 2011-06-22T07:00:00Z.
                            var pubDate = childNode.firstChild.nodeValue.split("-");
                            var date = new Date(pubDate[0], Number(pubDate[1]) - 1, pubDate[2].substr(0, 2));
                            issue[nodeName] = date;
                        } else if (childNode.nodeName == "magazineTitle") { // Make the property match the API.
                            issue["title"] = childNode.firstChild.nodeValue;
                        } else if (childNode.nodeName == "issueNumber") { // Make the property match the API.
                            issue["folioNumber"] = childNode.firstChild.nodeValue;
                        }else {
                            try {
                                issue[nodename] = childnode.firstchild.nodevalue;
                            }catch(e) {
                               
                            }
                        }
                    }
                }
                // only store the group data if the group title exists in our config file
                var exists = jQuery.inArray(issue["title"], WKIPAD.Config.FOLIO_LIST)
                    if (exists != -1) {
                    issues.push(issue);
                }
            }
            issues.sort(this.sortDatesDescending);

            return issues;
        }
        else
        {
            return null;
        }
    },
    sortDatesDescending: function (a, b) {
        if (a.publicationDate < b.publicationDate)
            return 1;
        else if (a.publicationDate > b.publicationDate)
            return -1;
        else
            return 0;
    }
});

// Library View
// --------------
var LibraryView = Backbone.View.extend({
    // library slider position
    position : 0,
    // groups (array of objects)
    groups: [],
    // reference to the library collection
    libraryCollection : null,
    // finalized collection
    groupedCollection: null,
    // large library current position
    largeLibraryPositionX: -1360,
    //default Journal to show up 
    defaultJournalId : 0,
    // last select id
    lastSelectedView: null,
    // last select large library
    previouslyActiveLargeLibraryItemView: null,
    // top library views
    topLibraryViews: [],
    // large library views
    largeLibraryViews: [],
    // previous index
    previouslySelectedIndex: 0,
    //groups
    groups:[],

    // The FamilyAppView listens for changes to its model, re-rendering.
    initialize: function() {
        var self = this;
        // set the page id
        var root = document.getElementById('main-wrapper');
            root.setAttribute('data-page-id','default');
        
        var html = "<header class=\"header primary\" id=\"primary-header\"></header>";
            html += "<div id=\"folios-container\">";
            html += "<div id=\"custom-instructions\">";
            html += "<div class=\"custom-instructions-text\">"+WKIPAD.Config.CUSTOM_INSTRUCTIONS+"</a>.</div>"
            html += "<div class=\"custom-instructions-close\">x</div></div>";
            html += "<section class=\"section primary\" id=\"section-primary\"></section>";
            html += "<section class=\"section secondary\" id=\"section-secondary\"></section>";
            html += "<section class=\"section tertiary\" id=\"section-tertiary\"></section>";
            html += "</div>";
            
        $("#main-wrapper").html(html);

        // temp
        $("#section-primary p").click(function(){
            window.location = "#library-detail-view/?id=Neurology Today";
        });

        var html = "<div class=\"column left header\">";
            html += "<nav><ul>";
            html += "<li>";
            html += "<div id=\"login-container\">";
            html += "<div id=\"login-button\">Sign In</div>";
            html += "<div id=\"logout-button\" style=\"display:none;\">Sign Out</div>";
            html += "</div>";
            html += "</li>";
            html += "</ul></nav></div>";
            html += "<div class=\"column middle header\" >"+WKIPAD.Config.PUBLICATION_TITLE+"</div>";
            html += "<div class=\"column right header\" style=\"text-align:right;margin-right: 0px\"><a href=\"#remove-folios-view\">Version: "+version+"</a></div>";

        $("#primary-header").html(html);

        var html = "<section class=\"section primary\" id=\"section-primary\"><p style=\"color:white;padding:5px;margin-left:10px;\"></section>";
            html += "<section class=\"section secondary\" id=\"section-secondary\"></section>";
            html += "<section class=\"section tertiary\" id=\"section-tertiary\"></section>";    


        $("#section-secondary").html("<article class=\"library primary\" id=\"primary-library\"></article><div class=\"bottom-library-arrow-up\"></div>");
        $("#section-primary").html("<article class=\"library top\" id=\"top-library\"></article>");
        $("#section-tertiary").html("<article class=\"library bottom\" id=\"bottom-library\"></article>");
        
        this.render();
//        if(sessionStorage.getItem("custominstructions") == null && sessionStorage.getItem("loggedin") == null){
//            self.displayCustomInstructions();
//        }
    },
    // Render the FamilyApp
    render: function() {
        var markup = "<ul>";
            markup += "</ul>";
        
        $("#top-library").html(markup);
        $("#primary-library").html(markup);


        $("#bottom-library").html(markup);

        $("#section-secondary").show();            
        
        var self = this;

        // click event for the login button
        $("#login-button").click(function() {
            self.displayLoginDialog();
        });

        // click event for the logout button
        $("#logout-button").click(function() {
            // log user out from dsp service
            adobeDPS.authenticationService.logout();
            self.userLoggedOut();
        });

         $(".custom-instructions-close").click(function(){
            self.closeCustomInstructions();
        });  

        if(isAPIAvailable == true) {

            // determine if the user is already logged in
            if (adobeDPS.authenticationService.isUserAuthenticated == true) {
                self.userLoggedIn();
                  
            }else{
                self.userLoggedOut();
            }

            // call to SDK
            this.folios = [];
            // Sort the folios descending order based on publication date
            var list = adobeDPS.libraryService.folioMap.sort(function (a, b) {
                if (a.publicationDate < b.publicationDate)
                    return 1;
                else if (a.publicationDate > b.publicationDate)
                    return -1;
                else
                    return 0;
            });
            // list is an associative array so put them in a regular array.
            for (var i in list) {
                var folio = list[i];
                this.folios.push(folio);
            }
            
          //  this.defaultJournalId = (this.folios.length/2) - 1;

            // The collection creates a clone of the folio objects so addFolios() passes a reference to the object.
            // Since the folios are not on a server we don't need to load anything so pass the folios to the constructor.
            this.libraryCollection = new LibraryCollection(this.folios);

            // Add the folios which are currently available. On the first launch this
            // does not guarentee that all folios are immediately available. The callback
            // below for folioMap.addedSignal will handle folios which are added after
            // startup. Added does not mean, pushed from folio producer, rather they
            // are folios that the viewer becomes aware of after startup.
            this.addFolios();
        }else{
            _.bindAll(this, "addFolios");
            this.libraryCollection = new LibraryCollection();
            this.libraryCollection.url = WKIPAD.Config.FULFILLMENT_URL;
            this.listenTo(this.libraryCollection, "reset sync remove", this.addFolios);
            this.libraryCollection.fetch({dataType: "xml"});
        }
        // lock scrolling
        document.ontouchmove = function(e){ e.preventDefault(); }
        // also make sure we are at 0,0 
        window.scrollTo(0,0);
    },
    addFolios : function (){            
        var self = this;
        // now create the groups
        if (this.groups.length == 0) {
            // group by title (already sorted by date)
            groupedCollection = this.libraryCollection.groupBy( function(model){
                return model.get('title');
            });
            var groupCount = 0;
            
            // get the groups            
            for (var key in groupedCollection) {
                if (groupedCollection.hasOwnProperty(key)) {
                    var groupObj = new Object(groupedCollection[key][0].attributes);
                    // only store the group data if the group title exists in our config file
                    var exists = jQuery.inArray(groupObj.title, WKIPAD.Config.FOLIO_LIST)
                    if (exists != -1) {
                        this.groups.push(groupedCollection[key]);
                    }
                    
                    groupCount++
                }
            }    

            // sort by title based on config
        }

        this.groups.sort(this.sortFunc);
        this.groups.reverse();
        
        // set session storage if it doesn't aleady exist
        var data = sessionStorage.getItem("selectedLibrary");
        
        if (!data) {
            sessionStorage.setItem('selectedLibrary', JSON.stringify(this.groups));    
        }

        // set the width of the library
        $("#primary-library").css("width",  (WKIPAD.Config.FOLIO_LIST.length + 1) * 
                                            (WKIPAD.Config.LARGE_COVER_WIDTH + WKIPAD.Config.LARGE_COVER_MARGIN_RIGHT)
                                  );
        
        var idMapper = this.groups.length - 1;
        // populate the primary library and top library
        for (var k = 0; k < this.groups.length; k++) {                
            var folio = this.groups[k][0];
            var view = new LargeLibraryItemView({model: folio});
            this.largeLibraryViews.push(view);
            var el = view.render().el;
            $("#primary-library ul").append(el);

            var view = new TopLibraryItemView({model: folio});
            this.topLibraryViews.push(view);
            var el = view.render().el;
            var mapId = view.mapId(idMapper);
            
            $("#top-library ul").append(el);
            idMapper --;
        }

        

        // iterate through all views and attach a listener
        // for when items are selected
        for (var k = 0; k < this.topLibraryViews.length; k++) {
            this.topLibraryViews[k].on('folio-selected', function(view) {
                if (self.previouslySelectedIndex == view.id) {
                    return;
                }
                self.position = view.id;
                self.largeLibraryViews[self.position].select();
                self.largeLibraryViews[self.previouslySelectedIndex].deselect();
                self.topLibraryViews[self.previouslySelectedIndex].deselect();
                var difference = Math.abs(self.position - self.previouslySelectedIndex);
                var num = difference * 395;
                if (self.previouslySelectedIndex > self.position) {
                    $("#primary-library").transition({ x: "-=" +num+"px" }, function () { self.updateBottomLibrary(self.groups[WKIPAD.Config.FOLIO_LIST.length-1-self.position]) });
                }else{
                    $("#primary-library").transition({ x: "+=" +num+"px" }, function () { self.updateBottomLibrary(self.groups[WKIPAD.Config.FOLIO_LIST.length-1-self.position]) });
                }

                self.lastSelectedView = view;
                self.previouslySelectedIndex = view.id;
            });
        }
        try {
            // now set the middle view to the selected state
            this.topLibraryViews[WKIPAD.Config.FOLIO_DEFAULT].select();
            this.topLibraryViews[WKIPAD.Config.FOLIO_DEFAULT].on('select-complete', function(view) {
                self.topLibraryItemSelected(view.id);
                self.position = view.id;
                self.previouslySelectedIndex = view.id;
            });
            // log as the last selected view
            this.lastSelectedView = this.topLibraryViews[WKIPAD.Config.FOLIO_DEFAULT];
            
            // select the middle large library view
            this.largeLibraryViews[WKIPAD.Config.FOLIO_DEFAULT].select();
        }catch(e) {

        }
//var output ="";

        // now populate the bottom library
        //var p = this.groups.length - 1;
        var title;
        for (var k = 1; k < Math.min(WKIPAD.Config.MAX_BOTTOM_LIBRARY_COVERS, this.groups[WKIPAD.Config.FOLIO_DEFAULT].length); k++) {
            var folio = this.groups[WKIPAD.Config.FOLIO_DEFAULT][k];
         //output += "<br/> " + folio.attributes.title;
            title = folio.attributes.title;
            var view = new BottomLibraryItemView({model: folio});
            var el = view.render().el;
            
        $("#bottom-library ul").append(el);
        }
        

        //$("body").html(output);
    //return;        
        //$("#bottom-library ul").append("<div><li class=\"bottom-library-item\"><div class=\"bottom-library-view-all-button\"></div></li></div>");

        var temp = '<div><li class="bottom-library-item"><div class=\"bottom-library-view-all-button\">Show All</div><div class="bottom-library-item-citation" style="visibility:hidden"><span>Vol. 81, No. 4, July 23, 2013</span></div></li></div>';
        $("#bottom-library ul").append(temp);
        // reverse the order to accomdate for the UI
        //this.groups.reverse();
        $(".bottom-library-view-all-button").click(function() {
            window.location = "#library-detail-view/?id="+title;
        });

        var offset = "-=";
            offset += String(((WKIPAD.Config.LARGE_COVER_WIDTH + WKIPAD.Config.LARGE_COVER_MARGIN_RIGHT) * (WKIPAD.Config.FOLIO_LIST.length - 4) + (WKIPAD.Config.LARGE_COVER_WIDTH / 2)));
            offset += "px";
            
        $("#primary-library").transition({ x: offset });

        // set the initial position
        this.position = WKIPAD.Config.FOLIO_DEFAULT;
        this.previouslySelectedIndex = this.position;

        // set the top level library width
        this.el = document.getElementById('section-secondary');
        var hammertime = Hammer(this.el, {drag_min_distance: 5}).on("swiperight", function(event) {
        //$("#section-secondary")
          //  .hammer({ drag_max_touches:0})
            //.on("swiperight", function(event) {
            if ((self.position) < (WKIPAD.Config.FOLIO_LIST.length - 1)) {
                self.position ++;
                self.topLibraryViews[self.position].select();
                self.topLibraryViews[self.previouslySelectedIndex].deselect();
                self.largeLibraryViews[self.position].select();
                self.largeLibraryViews[self.previouslySelectedIndex].deselect();
                var difference = Math.abs(self.position - self.previouslySelectedIndex);
                var num = difference * 395;
                if (self.previouslySelectedIndex > self.position) {
                    $("#primary-library").transition({ x: "-=" +num+"px" }, function () { self.updateBottomLibrary(self.groups[WKIPAD.Config.FOLIO_LIST.length-1-self.position]) });
                }else{
                    $("#primary-library").transition({ x: "+=" +num+"px" }, function () { self.updateBottomLibrary(self.groups[WKIPAD.Config.FOLIO_LIST.length-1-self.position]) });
                }
            }
            self.previouslySelectedIndex = self.position;
        });
        
        var hammertime = Hammer(this.el, {drag_min_distance: 5}).on("swipeleft", function(event) {
        //hammertime.on("swipeleft", function(event) {
            //$("#section-secondary")
            //.hammer({ drag_max_touches:0})
            //.on("swipeleft", function(event) {

            if (self.position > 0){
                self.position --;
                self.topLibraryViews[self.position].select();
                self.topLibraryViews[self.previouslySelectedIndex].deselect();
                self.largeLibraryViews[self.position].select();
                self.largeLibraryViews[self.previouslySelectedIndex].deselect();
                var difference = Math.abs(self.position - self.previouslySelectedIndex);
                var num = difference * 395;
                if (self.previouslySelectedIndex > self.position) {
                    $("#primary-library").transition({ x: "-=" +num+"px" }, function () { self.updateBottomLibrary(self.groups[WKIPAD.Config.FOLIO_LIST.length-1-self.position]) });
                }else{
                    $("#primary-library").transition({ x: "+=" +num+"px" }, function () { self.updateBottomLibrary(self.groups[WKIPAD.Config.FOLIO_LIST.length-1-self.position]) });
                }
            }
            self.previouslySelectedIndex = self.position;
        });
     

        // set up keyboard shortcuts for desktop development
        document.onkeydown = function(evt) {
            evt = evt || window.event;
            switch (evt.keyCode) {
                case 37:
                    if ((self.position) < (WKIPAD.Config.FOLIO_LIST.length - 1)) {
                        self.position ++;
                        self.topLibraryViews[self.position].select();
                        self.topLibraryViews[self.previouslySelectedIndex].deselect();
                        self.largeLibraryViews[self.position].select();
                        self.largeLibraryViews[self.previouslySelectedIndex].deselect();
                        var difference = Math.abs(self.position - self.previouslySelectedIndex);
                        var num = difference * 395;
                        if (self.previouslySelectedIndex > self.position) {
                            $("#primary-library").transition({ x: "-=" +num+"px" }, function () { self.updateBottomLibrary(self.groups[WKIPAD.Config.FOLIO_LIST.length-1-self.position]) });
                        }else{
                            $("#primary-library").transition({ x: "+=" +num+"px" }, function () { self.updateBottomLibrary(self.groups[WKIPAD.Config.FOLIO_LIST.length-1-self.position]) });
                        }
                    }
                break;
                case 39:
                    if (self.position > 0){
                        self.position --;
                        self.topLibraryViews[self.position].select();
                        self.topLibraryViews[self.previouslySelectedIndex].deselect();
                        self.largeLibraryViews[self.position].select();
                        self.largeLibraryViews[self.previouslySelectedIndex].deselect();
                        var difference = Math.abs(self.position - self.previouslySelectedIndex);
                        var num = difference * 395;
                        if (self.previouslySelectedIndex > self.position) {
                            $("#primary-library").transition({ x: "-=" +num+"px" }, function () { self.updateBottomLibrary(self.groups[WKIPAD.Config.FOLIO_LIST.length-1-self.position]) });
                        }else{
                            $("#primary-library").transition({ x: "+=" +num+"px" }, function () { self.updateBottomLibrary(self.groups[WKIPAD.Config.FOLIO_LIST.length-1-self.position]) });
                        }
                    }
                break;

            }
            self.previouslySelectedIndex = self.position;
        };
    },
    // an item from the top library was selected
    topLibraryItemSelected : function(id) {
        this.syncMiddleLibrary(id);
    },  
    // get the next top level library item
    getNextLibraryItem: function() {
        if ((this.position) == (WKIPAD.Config.FOLIO_LIST.length - 1)) {
            return;
        }
        this.syncMiddleLibrary(parseInt(this.position + 1));
    },
    // get the previous top level library item
    getPreviousLibraryItem : function() {
        // check to see if we are on the next to last item
        if (this.position == 0){
            return;
        }
        this.syncMiddleLibrary(parseInt(this.position -  1));
    },
    // jumps to a specific library item
    jumpToLibraryItem: function (id) {
        var difference = Math.abs(this.position - id);

        var self = this;
        var newPosition = difference * 395;
        var finalPosition = "";
        if (this.previouslySelectedIndex > this.position) {
            this.largeLibraryPositionX += newPosition;
            $("#primary-library").transition({ x: this.largeLibraryPositionX }, function () { self.updateBottomLibrary(self.groups[id]) });
        }else if (this.previouslySelectedIndex < this.position){
            this.largeLibraryPositionX -= newPosition;
            $("#primary-library").transition({ x: this.largeLibraryPositionX }, function () { self.updateBottomLibrary(self.groups[id]) });
        }else {
            //console.log("Do nothing");
        }

    },
    syncMiddleLibrary: function(id) {
        var difference = Math.abs(this.position - id);
        var self = this;
        var newPosition = difference * 395;
        var finalPosition = "";
        if (id > this.position) {
            this.largeLibraryPositionX += newPosition;
            $("#primary-library").transition({ x: this.largeLibraryPositionX }, function () { self.updateBottomLibrary(self.groups[id]) });
            this.previouslySelectedIndex = this.position;
            this.largeLibraryViews[this.previouslySelectedIndex].deselect();
        }else if (id < this.position){
            this.largeLibraryPositionX -= newPosition;
            $("#primary-library").transition({ x: this.largeLibraryPositionX }, function () { self.updateBottomLibrary(self.groups[id]) });
            this.previouslySelectedIndex = this.position;
            this.largeLibraryViews[this.previouslySelectedIndex].deselect();
        }else {
            //console.log("Do nothing");
        }
        this.position = id;
        this.largeLibraryViews[this.position].select();
    },
    userLoggedIn: function() {
        $("#login-button").hide();
        $("#logout-button").show();
        sessionStorage.setItem('loggedin',"true");
        this.hideCustomInstructions();
    },
    userLoggedOut: function() {
        $("#login-button").show();
        $("#logout-button").hide();
        sessionStorage.removeItem("loggedin");
        this.displayCustomInstructions();
    },
    displayLoginDialog: function() {
        var self = this;
        var loginDialog = new LoginView();
        $("body").append(loginDialog.render().el);
        
        // Triggered from the dialog when a login is successful.
        loginDialog.on("loginSuccess", function() {
            self.userLoggedIn();
        });
    },
    updateBottomLibrary: function(group) {
        // now populate the bottom library
        var p = group.length - 1;
        var title;

        // clear existing data
        $("#bottom-library ul").html("");
        for (var k = 1; k < Math.min(WKIPAD.Config.MAX_BOTTOM_LIBRARY_COVERS, group.length); k++) {
            var folio = group[k];
            title = folio.attributes.title;
            var view = new BottomLibraryItemView({model: folio});
            var el = view.render().el;
            
            $("#bottom-library ul").append(el);
        }

        var temp = '<div><li class="bottom-library-item"><div class=\"bottom-library-view-all-button\">Show All</div><div class="bottom-library-item-citation" style="visibility:hidden"><span>Vol. 81, No. 4, July 23, 2013</span></div></li></div>';
        $("#bottom-library ul").append(temp);

        $(".bottom-library-view-all-button").click(function() {
            window.location = "#library-detail-view/?id="+title;
        });
    },

    closeCustomInstructions : function(){
        var self = this;
        sessionStorage.setItem('custominstructions', "false");    
        self.hideCustomInstructions();

    },
    displayCustomInstructions : function(){
        var self = this;
        var showCustomInstructions = sessionStorage.getItem("custominstructions");
        var userLoggedIn = sessionStorage.getItem("userLoggedIn");
        if(showCustomInstructions == null && userLoggedIn == null){
            document.getElementById("custom-instructions").style.visibility = "visible";
        }else{
            self.hideCustomInstructions();
        }
    },
    hideCustomInstructions  : function(){
        document.getElementById("custom-instructions").style.visibility = "hidden";
        //$(".custom-instructions").hide(100);
    },
    sortFunc: function(a, b) {
        var sorti