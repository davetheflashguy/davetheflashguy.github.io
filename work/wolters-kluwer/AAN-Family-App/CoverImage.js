// ---------------
// The Cover Image Page
// ---------------




// Cover Image View
// --------------
var CoverImageView = Backbone.View.extend({
    folio: null,
    initialize: function () {
        var html = "<div class=\"cover-image-item\">";
        html += "<div class=\"cover-image-item-wrapper\">";
        html += "<div id=\"close-cover-image\"></div>";
        html += "<div class=\"cover-image-meta-data-container\">";
        html += "<div class=\"cover-image-meta-data-title\">";
        html += "</div>";
        html += "<div class=\"cover-image-buy-button\">";
        html += "</div>";
        html += "<div class=\"cover-image-meta-data-citation\">";
        html += "</div>";
        html += "</div>";
        html += "<div class=\"cover-image-container DetailViewImageContainer\"></div>";
        html += "</div>";
        html += "</div>";

        this.template = _.template(html);
    },
    // Render the Cover Image module
    render: function () {
        var self = this;
        if (this.model) {
            var json = (this.model);
            this.$el.html(this.template(json));
            // Get a reference to the original folio object.
            if (isAPIAvailable) {
                this.folio = adobeDPS.libraryService.folioMap.internal[json.id];
                this.previewImageTransaction = this.folio.getPreviewImage(490, 650, true);
                this.previewImageTransaction.completedSignal.addOnce(this.getPreviewImageHandler, this);
                // Add a handler to listen for updates.
                this.folio.updatedSignal.add(this.updatedSignalHandler, this);
                this.updateView();
            } else { // Testing on the desktop.
                this.$el.find(".cover-image-container").css("background-image", "url(" + json.libraryPreviewUrl + "/portrait" + ")");
            }

            this.$el.find(".cover-image-meta-data-title").html(this.model.title);
            this.$el.find(".cover-image-meta-data-citation").html(this.model.folioNumber);
        }
        this.$el.find('.cover-image-buy-button').click(function () {
            self.trigger("downloadClick");
            self.remove();
        });

        this.$el.find("#close-cover-image").click(function () {
            self.remove();
            //window.history.back();
        });

        /* Click anywhere outside the cover image to close */
        this.$el.click(function (e) {
            var target = $(e.target).attr('class');
            if (target == "cover-image-item") {
                self.remove();
            }
        });

        return this;
    },

    getPreviewImageHandler: function (transaction) {
        if (transaction.state == adobeDPS.transactionManager.transactionStates.FINISHED && transaction.previewImageURL != null) {
            this.$el.find(".cover-image-container").css("background-image", "url(" + transaction.previewImageURL + ")");
        } else if (transaction.previewImageURL == null) { // Sometimes previewImageURL is null so attempt another reload.
            var scope = this;
            this.reloadAttemptTimeout = setTimeout(function () {
                scope.previewImageTransaction = scope.folio.getPreviewImage(490, 650, true);
                scope.previewImageTransaction.completedSignal.addOnce(scope.getPreviewImageHandler, scope);
            }, 200);
        }
    },

    /* Called when a state of the folio changes, updates download button */
    updateView: function () {
        var self = this;
        var label = "";
        var state = "";
        //this.folio = adobeDPS.libraryService.folioMap.internal[this.model.attributes.id];
        var folioState = this.folio.state;
        switch (folioState) {
            case adobeDPS.libraryService.folioStates.INVALID:
                state = "Invalid";
                label = "Download"; // we want to show friendly labels
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

                state = "Entitled";
                label = "Download";
                break;
            case adobeDPS.libraryService.folioStates.DOWNLOADING:
                if (!this.folio.isViewable)

                    if (!this.currentDownloadTransaction || (this.currentDownloadTransaction && this.currentDownloadTransaction.progress == 0)) {
                        state = "Waiting";
                        label = "Waiting";
                    } else {
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
                break;
            case adobeDPS.libraryService.folioStates.PURCHASING:
                state = "PURCHASING"
                label = "PURCHASING";
            case adobeDPS.libraryService.folioStates.EXTRACTING:
                state = "Extracting"
                label = "Extracting";
            case adobeDPS.libraryService.folioStates.EXTRACTABLE:
                state = "Extracting";
                label = "View";
                break;
        }
    },
    updatedSignalHandler: function (properties) {
        this.updateView();
        if ((properties.indexOf("state") > -1 || properties.indexOf("currentTransactions") > -1) && this.folio.currentTransactions.length > 0)
            this.trackTransaction();
    },

    trackTransaction: function () {
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

            transaction.completedSignal.addOnce(function () {
                this.isTrackingTransaction = false;
            }, this)
        }
    },

    progressSignalChange: function (transaction) {
        this.setDownloadPercent(transaction.progress);
    },

    folioStateChange: function (transaction) {
        if (transaction.state == adobeDPS.transactionManager.transactionStates.FAILED) {
            this.download_completedSignalHandler(transaction);
            this.updateView();
        }
    },

    folioDownloadComplete: function (transaction) {
        transaction.stateChangedSignal.remove(this.download_stateChangedSignalHandler, this);
        transaction.progressSignal.remove(this.download_progressSignalHandler, this);
        transaction.completedSignal.remove(this.download_completedSignalHandler, this);
        this.isTrackingTransaction = false;
    },

    setDownloadPercent: function (value) {
        // in this class this function does nothing and shouldn't be called
    },

    hideDownloadButton: function () {
        this.$el.find(".cover-image-buy-button").css("opacity", "0");
    },

//    buyButtonSelected: function () {
//        var state = this.folio.state;
//        if (state == adobeDPS.libraryService.folioStates.PURCHASABLE) {

//        } else if (state == adobeDPS.libraryService.folioStates.INSTALLED || this.folio.isViewable) {
//            this.folio.view();
//        } else if (state == adobeDPS.libraryService.folioStates.ENTITLED) {
//            this.folio.download();
//        }
//    }
});