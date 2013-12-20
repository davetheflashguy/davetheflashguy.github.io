// TopLibraryItem
// --------------
var TopLibraryItemView = Backbone.View.extend({
    // id of class on canvas
    id: null,
    // max times we want to try and load an image when it fails
    maxImageLoadTries: 5,
    // counts how many times we've tried to load a thumbnail when it fails
    numImageLoadTries: 0,
    // time to wait before trying to reload the image (ms)
    imageRetryDelay: 1000,

    initialize : function(){
        var html = "<li class=\"top-library-item\">";
            html += "<div class=\"top-library-image-container\"></div>";
            html += "<div id='debug' style=\"text-align:left;width:350px;display:none;\">Debug</div>";
            html += "</div>";
            html + "</li>";
            
        this.template = _.template(html);
    },
    render : function(){
        var self = this;
        if (this.model) {
            var json = this.model.toJSON();
            this.$el.html(this.template(json));
            // Get a reference to the original folio object.
            if (isAPIAvailable) {
                this.folio = adobeDPS.libraryService.folioMap.internal[this.model.attributes.id];
                this.previewImageTransaction = this.folio.getPreviewImage(WKIPAD.Config.TOP_LIBRARY_COVER_WIDTH, WKIPAD.Config.TOP_LIBRARY_COVER_HEIGHT, true);
                this.previewImageTransaction.completedSignal.addOnce(this.getPreviewImageHandler, this);
                // Add a handler to listen for updates.
                this.folio.updatedSignal.add(this.updatedSignalHandler, this);
                //this.updateView();
                this.$el.find(".top-library-image-container").css("background-image", "url("+ WKIPAD.Config.TOP_LIBRARY_PRE_LOADER_IMAGE +")");  
                this.$el.find(".top-library-image-container").css("background-size", WKIPAD.Config.TOP_LIBRARY_PRE_LOADER_IMAGE_WIDTH + "px" + " " + WKIPAD.Config.TOP_LIBRARY_PRE_LOADER_IMAGE_HEIGHT + "px");  
                this.$el.find(".top-library-image-container").css("background-repeat", "no-repeat");
                this.$el.find(".top-library-image-container").css("background-position", "50%");
            } else { 
                // Testing on the desktop.
                this.$el.find(".top-library-image-container").css("background-image", "url("+ json.libraryPreviewUrl + "/portrait"+")");  
                this.folio = json;
            }
        }
        var scope = this.$el.find(".top-library-image-container");
        this.$el.find(".top-library-image-container").click(function(){
           self.trigger("folio-selected", self);
           self.select();
        });

        // each item should be deselected to start out
        this.deselect();

        return this;
    },
    getPreviewImageHandler: function(transaction) {
        var self = this;
        if (this.numImageLoadTries < this.maxImageLoadTries) {
            if (transaction.state == adobeDPS.transactionManager.transactionStates.FINISHED && transaction.previewImageURL != null) {
                this.$el.find(".top-library-image-container").css("background-image", "url("+ transaction.previewImageURL+")");  
                this.$el.find(".top-library-image-container").css("background-size", WKIPAD.Config.TOP_LIBRARY_COVER_WIDTH + "px" + " " + WKIPAD.Config.TOP_LIBRARY_COVER_HEIGHT + "px");  
                this.$el.find(".top-library-image-container").css("background-repeat", "no-repeat");
                this.$el.find(".top-library-image-container").css("background-position", "50%");
                
            } else if (transaction.previewImageURL == null) { // Sometimes previewImageURL is null so attempt another reload.
                this.$el.find(".top-library-image-container").css("background-image", "url("+ WKIPAD.Config.TOP_LIBRARY_PRE_LOADER_IMAGE +")");  
                this.$el.find(".top-library-image-container").css("background-size", WKIPAD.Config.TOP_LIBRARY_PRE_LOADER_IMAGE_WIDTH + "px" + " " + WKIPAD.Config.TOP_LIBRARY_PRE_LOADER_IMAGE_HEIGHT + "px");  
                this.$el.find(".top-library-image-container").css("background-repeat", "no-repeat");
                this.$el.find(".top-library-image-container").css("background-position", "50%");
                var scope = this;
                    scope.reloadAttemptTimeout = setTimeout(function() {
                    scope.previewImageTransaction = scope.folio.getPreviewImage(WKIPAD.Config.TOP_LIBRARY_COVER_WIDTH, WKIPAD.Config.TOP_LIBRARY_COVER_HEIGHT, true);
                    scope.previewImageTransaction.completedSignal.addOnce(scope.getPreviewImageHandler, scope);
                    scope.numImageLoadTries ++;
                }, scope.imageRetryDelay);
            }
        }        
    },
    /* Called when a state of the folio changes, updates download button */
    updateView: function(){
        var self = this;
        var label = "";
        var state = "";
        var folioState = this.folio.state;
        switch (folioState) {
            case adobeDPS.libraryService.folioStates.INVALID:
                state = "Invalid";
                label = "Download"; // we want to show friendly labels
                //self.hideDownloadButton();
                break;
            case adobeDPS.libraryService.folioStates.UNAVAILABLE:
                state = "Unavailable";
                label = "Download";
                //self.hideDownloadButton();
                break;
            case adobeDPS.libraryService.folioStates.PURCHASABLE:
                label = "Buy " + this.folio.price;
                state = "Purchasable";
                break;
            case adobeDPS.libraryService.folioStates.ENTITLED:
                //this.enableBuyButton(true);
                //this.showArchiveButton(false);
                
                state = "Entitled";
                label = "Download";
                break;
            case adobeDPS.libraryService.folioStates.DOWNLOADING:
                if (!this.folio.isViewable)
                    //this.enableBuyButton(false);
                
                if (!this.currentDownloadTransaction || (this.currentDownloadTransaction && this.currentDownloadTransaction.progress == 0)) {
                    this.setDownloadPercent(0);
                    state = "Waiting";
                    label = "Waiting";
                }else {
                    label = "Downloading";
                    state = "Downloading";
                }

                if (this.folio.isViewable) {
                    label = "View";

                }

                break;
            case adobeDPS.libraryService.folioStates.INSTALLED:
                state = "Installed";
                label = "View";
                //self.setDownloadPercent(100);
                //this.showArchiveButton(true);
                break;
            case adobeDPS.libraryService.folioStates.PURCHASING:
                state = "PURCHASING"
                label = "PURCHASING";
                self.hideDownloadButton();
            case adobeDPS.libraryService.folioStates.EXTRACTING:
                state = "Extracting"
                label = "Extracting";
                //self.hideDownloadButton();
            case adobeDPS.libraryService.folioStates.EXTRACTABLE:
                state = "Extracting";
                label = "View";
                //self.setDownloadPercent(100);
                break;
        }
        this.$el.find("#debug").html(state);
        //this.$el.find(".column-right").find('.buy-button').text(label);
    },
    /* Fired during a signal change */
    updatedSignalHandler: function(properties) {
        this.updateView();

        if ((properties.indexOf("state") > -1 || properties.indexOf("currentTransactions") > -1) && this.folio.currentTransactions.length > 0)
        this.trackTransaction();
    },
    trackTransaction: function() {
        if (this.isTrackingTransaction)
            return;
            
        var transaction;
        for (var i = 0; i < this.folio.currentTransactions.length; i++) {
            transaction = this.folio.currentTransactions[i];
            if (transaction.isFolioStateChangingTransaction()) {
                // found one, so break and attach to this one
                break;
            } else {
                // null out transaction since we didn't find a traceable one
                transaction = null;
            }
        }

        if (!transaction)
            return;
        
        // Make sure to only track the transactions below.
        var transactionType = transaction.jsonClassName;
        if (transactionType != "DownloadTransaction" &&
            transactionType != "UpdateTransaction" &&
            transactionType != "PurchaseTransaction" &&
            transactionType != "ArchiveTransaction" &&
            transactionType != "ViewTransaction") {
                return;
        }

        // Check if the transaction is active yet
        if (transaction.state == adobeDPS.transactionManager.transactionStates.INITALIZED) {
            // This transaction is not yet started, but most likely soon will
            // so setup a callback for when the transaction starts
            transaction.stateChangedSignal.addOnce(this.trackTransaction, this);
            return;
        }
        
        this.isTrackingTransaction = true;
        
        this.currentDownloadTransaction = null;
        if (transactionType == "DownloadTransaction" || transactionType == "UpdateTransaction") {
            transaction.stateChangedSignal.add(this.folioStateChange, this);
            transaction.progressSignal.add(this.progressSignalChange, this);
            transaction.completedSignal.add(this.folioDownloadComplete, this);
            this.currentDownloadTransaction = transaction;
            
            transaction.completedSignal.addOnce(function() {
                this.isTrackingTransaction = false;
            }, this)
        }
    },
    progressSignalChange: function(transaction){
        //this.setDownloadPercent(transaction.progress);
    },
    folioStateChange: function(transaction){
        if (transaction.state == adobeDPS.transactionManager.transactionStates.FAILED) {
            this.download_completedSignalHandler(transaction);
            //this.updateView();
            //this.enableBuyButton(true);
        } else if (transaction.state == adobeDPS.transactionManager.transactionStates.PAUSED) {
            //this.$state.html("Paused");
            //this.$el.find(".column-right").find('.buy-button').text("Paused");
        } else {
            //this.$state.html("");
        }
    },
    folioDownloadComplete: function(transaction){
        transaction.stateChangedSignal.remove(this.download_stateChangedSignalHandler, this);
        transaction.progressSignal.remove(this.download_progressSignalHandler, this);
        transaction.completedSignal.remove(this.download_completedSignalHandler, this);
            
        this.isTrackingTransaction = false;
        this.hideProgressBar();
    },
    setDownloadPercent : function(value){
        this.$el.find("#debug").html("Downloading: " + Math.round(value * (this.folio.downloadSize / 1000000)) + " MB of " + Math.round(this.folio.downloadSize / 1000000) + " MB");
        this.$el.find(".progress-bar").width(String(Math.round(value))+"%");
    },
    hideDownloadButton: function(){
        //this.$el.find(".buy-button").hide();
        //this.$el.find(".buy-button").css("opacity",".35");
    },
    buyButtonSelected: function(){
        this.$el.find("#debug").html("Folio Selected");
        var state = this.folio.state;
        if (state == adobeDPS.libraryService.folioStates.PURCHASABLE) {
            //this.purchase();
            alert("Error: Purchases are not available at this time.")
        } else if (state == adobeDPS.libraryService.folioStates.INSTALLED || this.folio.isViewable) {
            this.folio.view();
        } else if (state == adobeDPS.libraryService.folioStates.ENTITLED) {
            this.folio.download();
            this.showProgressBar();
        }
    },
    showProgressBar: function() {
        //this.$el.find(".progress-bar-container").css("display", "block");
    },
    hideProgressBar: function() {
        //this.$el.find(".progress-bar-container").css("display", "none");
    },
    mapId: function(_id){
        this.id = _id;
    },
    /* Expands an item when it is selected */
    select: function() {
        var self = this;
        this.$el.transition({ opacity: 1, scale: WKIPAD.Config.TOP_LIBRARY_SCALE}, WKIPAD.Config.TOP_LIBRARY_TRANSITION_SPEED, 
            function () { 
                //self.trigger("select-complete", self);
            });
    },
    /* Contracts an item when it was previously selected and another item has been selected */
    deselect: function() {
        this.$el.transition({opacity: WKIPAD.Config.TOP_LIBRARY_ALPHA_FADE, scale: 1 }, WKIPAD.Config.TOP_LIBRARY_TRANSITION_SPEED, 
            function () { 
            });
    }
});