// BottomLibraryItem
// --------------
var BottomLibraryItemView = Backbone.View.extend({
    folio: null,
    initialize: function () {
        var html = "<li class=\"bottom-library-item\">";
        html += "<div class=\"bottom-library-image-container\"><div class=\"bottom-library-progress-bar-container\" style=\"display:none;\" ><div class=\"bottom-library-progress-bar\"></div></div></div>";
        html += "<div class=\"bottom-library-item-citation\"></div>";
        html += "<div class=\"bottom-library-button-container\"></div>";
        html += "</div>";
        html + "</li>";

        this.template = _.template(html);
    },
    render: function () {
        var self = this;
        if (this.model) {
            var json = this.model.toJSON();
            this.$el.html(this.template(json));
            // Get a reference to the original folio object.
            if (isAPIAvailable) {
                this.folio = adobeDPS.libraryService.folioMap.internal[this.model.attributes.id];
                this.previewImageTransaction = this.folio.getPreviewImage(WKIPAD.Config.BOTTOM_LIBRARY_COVER_WIDTH, WKIPAD.Config.BOTTOM_LIBRARY_COVER_HEIGHT, true);
                this.previewImageTransaction.completedSignal.addOnce(this.getPreviewImageHandler, this);
                // Add a handler to listen for updates.
                this.folio.updatedSignal.add(this.updatedSignalHandler, this);
                this.updateView();
                this.$el.find(".bottom-library-image-container").css("background-image", "url("+ WKIPAD.Config.BOTTOM_LIBRARY_PRE_LOADER_IMAGE +")");  
                this.$el.find(".bottom-library-image-container").css("background-size", WKIPAD.Config.BOTTOM_LIBRARY_PRE_LOADER_IMAGE_WIDTH + "px" + " " + WKIPAD.Config.BOTTOM_LIBRARY_PRE_LOADER_IMAGE_HEIGHT + "px");  
                this.$el.find(".bottom-library-image-container").css("background-repeat", "no-repeat");
                this.$el.find(".bottom-library-image-container").css("background-position", "50%");
            } else {
                // Testing on the desktop.

                this.$el.find(".bottom-library-image-container").css("background-image", "url(" + WKIPAD.Config.APP_URL + WKIPAD.Config.PRE_LOADER_IMAGE + ")");
                var coverImage = new Image();
                coverImage.onload = function () {
                    self.$el.find(".bottom-library-image-container").css("background-image", "url(" + json.libraryPreviewUrl + "/portrait" + ")");

                }
                coverImage.src = json.libraryPreviewUrl + "/portrait";

                this.folio = json;
            }

            this.$el.find(".bottom-library-item-citation").html("<span>" + json.folioNumber + "</span>");
        }

        this.$el.find('.bottom-library-image-container').click(function () {
            if (isAPIAvailable == true) {
                this.folio = adobeDPS.libraryService.folioMap.internal[self.model.attributes.id];
                if (this.folio.state == adobeDPS.libraryService.folioStates.INSTALLED) {
                    this.folio.view();
                }
                else {
                    self.showCoverImage(json);
                }
            }
            else {
                self.showCoverImage(json);
            }
        });
        return this;
    },
    getPreviewImageHandler: function (transaction) {
        var self = this;
        if (transaction.state == adobeDPS.transactionManager.transactionStates.FINISHED && transaction.previewImageURL != null) {
            this.$el.find(".bottom-library-image-container").css("background-image", "url("+ transaction.previewImageURL +")");  
            this.$el.find(".bottom-library-image-container").css("background-size", WKIPAD.Config.BOTTOM_LIBRARY_IMAGE_WIDTH + "px" + " " + WKIPAD.Config.BOTTOM_LIBRARY_IMAGE_HEIGHT + "px");  
            this.$el.find(".bottom-library-image-container").css("background-repeat", "no-repeat");
            this.$el.find(".bottom-library-image-container").css("background-position", "50%");
        } else if (transaction.previewImageURL == null) { // Sometimes previewImageURL is null so attempt another reload.
            this.$el.find(".bottom-library-image-container").css("background-image", "url("+ WKIPAD.Config.BOTTOM_LIBRARY_PRE_LOADER_IMAGE +")");  
            this.$el.find(".bottom-library-image-container").css("background-size", WKIPAD.Config.BOTTOM_LIBRARY_PRE_LOADER_IMAGE_WIDTH + "px" + " " + WKIPAD.Config.BOTTOM_LIBRARY_PRE_LOADER_IMAGE_HEIGHT + "px");  
            this.$el.find(".bottom-library-image-container").css("background-repeat", "no-repeat");
            this.$el.find(".bottom-library-image-container").css("background-position", "50%");
            var scope = this;
            this.reloadAttemptTimeout = setTimeout(function () {
                scope.previewImageTransaction = scope.folio.getPreviewImage(WKIPAD.Config.BOTTOM_LIBRARY_COVER_WIDTH, WKIPAD.Config.BOTTOM_LIBRARY_COVER_HEIGHT, true);
                scope.previewImageTransaction.completedSignal.addOnce(scope.getPreviewImageHandler, scope);
            }, 200);
        }
    },
    /* Called when a state of the folio changes, updates download button */
    updateView: function () {
        try {
            var self = this;
            var label = "";
            var state = "";
            var downloadHTML = "";
            var folioState = this.folio.state;
            switch (folioState) {
                case adobeDPS.libraryService.folioStates.INVALID:
                    self.hideDownloadButton();
                    break;
                case adobeDPS.libraryService.folioStates.UNAVAILABLE:
                    self.hideDownloadButton();
                    this.$el.find(".bottom-library-button-container").html("<div class=\"bottom-library-non-entitled\">&nbsp;&nbsp;&nbsp;Non</br>Entitled</div>");
                    break;
                case adobeDPS.libraryService.folioStates.PURCHASABLE:
                    this.$el.find(".column-right").html("<div class=\"price-button\">" + this.folio.price + "</div>");
                    break;
                case adobeDPS.libraryService.folioStates.ENTITLED:
                    this.$el.find(".bottom-library-button-container").html("<div class=\"bottom-library-download-button\"></div>");

                    this.$el.find('.bottom-library-download-button').click(function () {
                        self.buyButtonSelected();
                    });
                    break;
                case adobeDPS.libraryService.folioStates.DOWNLOADING:
                    if (!this.currentDownloadTransaction || (this.currentDownloadTransaction && this.currentDownloadTransaction.progress == 0)) {
                        this.setDownloadPercent(0);
        
                        self.hideDownloadButton();
                        if (this.currentDownloadTransaction.isCancelable == true) {
                            this.$el.find(".bottom-library-button-container").html("<div class=\"bottom-library-cancel-button\"/>");
                        }
                    }
                    else {
                        self.hideDownloadButton();
                        self.showProgressBar();
                        if (this.currentDownloadTransaction.isCancelable == true) {
                            this.$el.find(".bottom-library-button-container").html("<div class=\"bottom-library-cancel-button\"/>");
                        }
    
                    }
                    if (this.currentDownloadTransaction.state == adobeDPS.transactionManager.transactionStates.PAUSED) {
                        this.setDownloadPercent(this.currentDownloadTransaction.progress);
                        this.$el.find(".bottom-library-button-container").html("<div class=\"bottom-library-resume-button\"></div>");
                    }

                    if (this.folio.isViewable) {
                        self.hideDownloadButton();
                    }

                    break;
                case adobeDPS.libraryService.folioStates.INSTALLED:
                    self.setDownloadPercent(100);
                    self.hideDownloadButton();
                    break;
                case adobeDPS.libraryService.folioStates.PURCHASING:
                    self.hideDownloadButton();
                    this.$el.find(".bottom-library-button-container").html("<div class=\"bottom-library-cancel-button\"/>");
                case adobeDPS.libraryService.folioStates.EXTRACTING:
                    self.hideDownloadButton();
                case adobeDPS.libraryService.folioStates.EXTRACTABLE:
                    self.hideDownloadButton();
                    self.setDownloadPercent(100);
                    break;
            }
            this.$el.find(".bottom-library-cancel-button").click(function () {
                self.setDownloadPercent(0);
                self.cancelTransaction(self.currentDownloadTransaction);
            });
            this.$el.find(".bottom-library-resume-button").click(function () {
                self.resumeTransaction(self.currentDownloadTransaction);
            });
        }catch(e) {
            
        }
        
    },
    /* Fired during a signal change */
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
            transaction.completedSignal.add(this.folioTransactionComplete, this);
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
        if (transaction.state == adobeDPS.transactionManager.transactionStates.PAUSED) {
            this.setDownloadPercent(transaction.progress);
            this.$el.find(".bottom-library-button-container").html("<div class=\"bottom-library-resume-button\"></div>");
            this.$el.find(".bottom-library-resume-button").click(function () {
                self.resumeTransaction(transaction);
            });
        }
        this.updateView();
    },
    folioTransactionComplete: function (transaction) {
        this.folio.view();
    },
    setDownloadPercent: function (value) {
        this.$el.find("#debug").html("Downloading: " + Math.round(value * (this.folio.downloadSize / 1000000)) + " MB of " + Math.round(this.folio.downloadSize / 1000000) + " MB");
        this.$el.find(".bottom-library-progress-bar").width(String(Math.round(value)) + "%");
    },
    hideDownloadButton: function () {
        this.$el.find(".bottom-library-download-button").css("opacity", "0");
    },
    buyButtonSelected: function () {
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
    showProgressBar: function () {
        this.$el.find(".bottom-library-progress-bar-container").css("display", "block");
    },
    hideProgressBar: function () {
        this.$el.find(".bottom-library-progress-bar-container").css("display", "none");
    },
    showCoverImage: function (folio) {
        var self = this;
        var coverImageDialog = new CoverImageView({ model: folio });
        $("#folios-container").append(coverImageDialog.render().el);
        coverImageDialog.on("downloadClick", function () {
            self.buyButtonSelected();
        });
    },
    cancelTransaction: function (transaction) {
        var self = this;
        var progressPercent = transaction.progress;
        if (progressPercent < 100) {
            transaction.cancel();
            transaction.stateChangedSignal.add(self.folioStateChange, self);
            transaction.progressSignal.add(self.progressSignalChange, self);
            transaction.completedSignal.add(self.folioTransactionComplete, self);
        }
    },
    resumeTransaction: function (transaction) {
        var self = this;
        if (transaction.isCancelable == true) {
            self.$el.find(".bottom-library-button-container").html("<div class=\"bottom-library-cancel-button\"/>");
        }
        self.$el.find(".bottom-library-cancel-button").click(function () {
            self.cancelTransaction(transaction);
        });
        var progressPercent = transaction.progress;
        if (progressPercent < 100) {
            transaction.resume();
            transaction.stateChangedSignal.add(self.folioStateChange, self);
            transaction.progressSignal.add(self.progressSignalChange, self);
            transaction.completedSignal.add(self.folioTransactionComplete, self);
        }
    }
});