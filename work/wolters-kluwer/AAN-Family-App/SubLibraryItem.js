// SubLibraryItem
// --------------
var SubLibraryItemView = Backbone.View.extend({
    previewImageTransaction: null,
    folio: null,
    json: null,
    initialize : function(){
        var html = "<li class=\"SubLibraryItem\">";
            html += "<div class=\"secondary-library-image-container\"></div>";
            html += "<div class=\"progress-bar-container\"><div class=\"progress-bar\"></div></div>";
            html += "<div class=\"LibraryInfoContainer\">";
            html += '<div id="CitationContainer" class="CitationContainer"></div>';
            html += "<div class=\"buy-button-sub-library\">Download</div>";
            html += "</div>";
            html += "</li>";
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
                this.previewImageTransaction = this.folio.getPreviewImage(90, 120, true);
                this.previewImageTransaction.completedSignal.addOnce(this.getPreviewImageHandler, this);
                // Add a handler to listen for updates.
                this.folio.updatedSignal.add(this.updatedSignalHandler, this);
                this.updateView();
                
                //this.$el.find(".primary-library-image-container").html("<img src='"+ json.libraryPreviewUrl + "/portrait" + "' width='350' height='460'/>");
            } else { // Testing on the desktop.
                this.$el.find(".secondary-library-image-container").html("<img src='"+ json.libraryPreviewUrl + "/portrait" + "' width='90' height='120'/>");
                
            }
            this.$el.find(".CitationContainer").html("<span>"+json.folioNumber+"</span>");   
        }
        this.$el.find('.buy-button-sub-library').click(function(){
            self.buyButtonSelected();
        });
        return this;
    },
        getPreviewImageHandler: function(transaction) {
            //alert("within image handler")
            if (transaction.state == adobeDPS.transactionManager.transactionStates.FINISHED && transaction.previewImageURL != null) {
                this.$el.find(".secondary-library-image-container").html("<img src='"+ transaction.previewImageURL + "' width='90' height='120'/>");
                
            } else if (transaction.previewImageURL == null) { // Sometimes previewImageURL is null so attempt another reload.
                var scope = this;
                this.reloadAttemptTimeout = setTimeout(function() {
                    scope.previewImageTransaction = scope.folio.getPreviewImage(90, 120, true);
                    scope.previewImageTransaction.completedSignal .addOnce(scope.getPreviewImageHandler, scope);
                }, 200);
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
                    label = "Download";
                    self.hideDownloadButton();
                    break;
                case adobeDPS.libraryService.folioStates.UNAVAILABLE:
                    state = "Unavailable";
                    label = "Download";
                    self.hideDownloadButton();
                    break;
                case adobeDPS.libraryService.folioStates.PURCHASABLE:
                    label = "Buy " + this.folio.price;
                    state = "Purchasable";
                    break;
                case adobeDPS.libraryService.folioStates.ENTITLED:
                    //this.enableBuyButton(true);
                    //this.showArchiveButton(false);
                    
                    label = "Download";
                    state = "Entitled";
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
                    self.setDownloadPercent(100);
                    //this.showArchiveButton(true);
                    break;
                case adobeDPS.libraryService.folioStates.PURCHASING:
                    state = "PURCHASING"
                    label = "PURCHASING";
                    self.hideDownloadButton();
                case adobeDPS.libraryService.folioStates.EXTRACTING:
                    state = "Extracting"
                    label = "Extracting";
                    self.hideDownloadButton();
                case adobeDPS.libraryService.folioStates.EXTRACTABLE:
                    state = "Extracting";
                    label = "View";
                    self.setDownloadPercent(100);
                    break;
            }
            //this.$el.find(".CitationContainer").html(state);
            this.$el.find('.buy-button-sub-library').text(label);
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
            this.setDownloadPercent(transaction.progress);
        },
        folioStateChange: function(transaction){
            if (transaction.state == adobeDPS.transactionManager.transactionStates.FAILED) {
                this.download_completedSignalHandler(transaction);
                this.updateView();
                //this.enableBuyButton(true);
            } else if (transaction.state == adobeDPS.transactionManager.transactionStates.PAUSED) {
                //this.$state.html("Paused");
            } else {
                //this.$state.html("");
            }
        },
        folioDownloadComplete: function(transaction){
            transaction.stateChangedSignal.remove(this.download_stateChangedSignalHandler, this);
            transaction.progressSignal.remove(this.download_progressSignalHandler, this);
            transaction.completedSignal.remove(this.download_completedSignalHandler, this);
                
            this.isTrackingTransaction = false;
            if (transaction.state == adobeDPS.transactionManager.transactionStates.FINISHED) {
                this.setDownloadPercent(100);
            }
            this.hideProgressBar();
            this.$el.find(".close-button-css").css("visibility", "hidden");
            this.folio.view();
        },
        setDownloadPercent : function(value){
            this.$el.find("#debug").html("Downloading: " + Math.round(value * (this.folio.downloadSize / 1000000)) + " MB of " + Math.round(this.folio.downloadSize / 1000000) + " MB");
            this.$el.find(".progress-bar").width(String(Math.round(value))+"%");
        },
        hideDownloadButton: function(){
            //this.$el.find(".buy-button").hide();
            this.$el.find(".buy-button-sub-library").css("opacity",".35");
        },
        showProgressBar: function () {
            this.$el.find(".progress-bar-container").css("display", "block");
        },
        hideProgressBar: function () {
            this.$el.find(".progress-bar-container").css("display", "none");
        },
        buyButtonSelected: function(){
            var state = this.folio.state;
            if (state == adobeDPS.libraryService.folioStates.PURCHASABLE) {
                //this.purchase();
                alert("Error: Purchases are not available at this time.")
            } else if (state == adobeDPS.libraryService.folioStates.INSTALLED || this.folio.isViewable) {
                this.folio.view();
            } else if (state == adobeDPS.libraryService.folioStates.ENTITLED) {
                this.folio.download();
            }
        },
});