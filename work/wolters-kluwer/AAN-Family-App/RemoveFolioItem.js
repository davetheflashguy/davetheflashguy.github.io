// RemoveFolioItem
// --------------
var RemoveFolioItemView = Backbone.View.extend({
    previewImageTransaction: null,
    folio: null,
    json: null,


    initialize: function () {

        var html = "<div class=\"remove-folio-item\">";
        html += "<div class=\"remove-folio-image-container remove-folio-citation-container\"></div>";
        html += "<div class=\"remove-folio-meta-data-container\">";
        html += "<div class=\"remove-folio-meta-data-title\">";
        html += "</div>";
        html += "<div class=\"remove-folio-meta-data-citation\">";
        html += "</div>";
        html += "</div>" // meta data container
        //html += "<div id='debug' style=\"text-align:left;width:350px;visibility:hidden;\">Debug</div>";
        html += "</div>";
        this.template = _.template(html);
    },

    render: function () {
        var self = this;
        if (this.model) {
            var json = (this.model);
            this.$el.html(this.template(json));
            // Get a reference to the original folio object.
            if (isAPIAvailable) {
                this.folio = adobeDPS.libraryService.folioMap.internal[json.id];
                this.previewImageTransaction = this.folio.getPreviewImage(200, 225, true);
                this.previewImageTransaction.completedSignal.addOnce(this.getPreviewImageHandler, this);
                // Add a handler to listen for updates.
                this.folio.updatedSignal.add(this.updatedSignalHandler, this);

            } else { // Testing on the desktop.
                this.$el.find(".remove-folio-image-container").html("<img class=\"remove-folio-mage\" src='" + this.model.libraryPreviewUrl + "/portrait" + "' width='220' /><img class=\"remove-folio-check\">");
            }

            this.$el.find(".remove-folio-meta-data-title").html("<p>" + this.model.title + "</p>");
            this.$el.find(".remove-folio-meta-data-citation").html("<p class=\"remove-folio-citation-container\">" + this.model.folioNumber + "</p>");
        }

        this.$el.find(".remove-folio-item").click(function () {
            self.trigger("removeFolioSelected", self.model);
        });
        if (this.folio.state == adobeDPS.libraryService.folioStates.INSTALLED)
        return this;
    },

    getPreviewImageHandler: function (transaction) {
        if (transaction.state == adobeDPS.transactionManager.transactionStates.FINISHED && transaction.previewImageURL != null) {
            this.$el.find(".remove-folio-image-container").html("<img src='" + transaction.previewImageURL + "' width='220' />");
        } else if (transaction.previewImageURL == null) { // Sometimes previewImageURL is null so attempt another reload.
            var scope = this;
            this.reloadAttemptTimeout = setTimeout(function () {
                scope.previewImageTransaction = scope.folio.getPreviewImage(200, 225, true);
                scope.previewImageTransaction.completedSignal.addOnce(scope.getPreviewImageHandler, scope);
            }, 200);
        }
    },


    updatedSignalHandler: function (properties) {
        if ((properties.indexOf("state") > -1 || properties.indexOf("currentTransactions") > -1) && this.folio.currentTransactions.length > 0)
            this.trackTransaction();
    },

    trackTransaction: function () {
        var self = this;
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
        if (transactionType != "ArchiveTransaction") {
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

        this.currentArchiveTransaction = null;
        if (transactionType == "ArchiveTransaction") {

            transaction.stateChangedSignal.add(self.folioStateChange, self);
            //transaction.completedSignal.add(self.folioArchiveComplete, self);
            this.currentArchiveTransaction = transaction;

            transaction.completedSignal.addOnce(function () {
                this.isTrackingTransaction = false;
            }, this)
        }
    },

    folioStateChange: function (transaction) {
        var self = this;
        if (transaction.state == adobeDPS.transactionManager.transactionStates.FINISHED || transaction.state == adobeDPS.transactionManager.transactionStates.FAILED || transaction.state == adobeDPS.transactionManager.transactionStates.CANCELED) {
            transaction.completedSignal.add(self.folioArchiveComplete, self);
            self.folioArchiveComplete(transaction);
        }
    },
    folioArchiveComplete: function (transaction) {
        var self = this;
        transaction.stateChangedSignal.remove(self.folioStateChange, self);
        self.isTrackingTransaction = false;
        if (transaction.state == adobeDPS.transactionManager.transactionStates.FINISHED) {
            self.trigger("TransactionDone", self.model);
            transaction.completedSignal.remove(self.folioArchiveComplete, self);
        }
        transaction.completedSignal.remove(self.folioArchiveComplete, self);
    },
    removeFolio: function () {
        var self = this;
        if (this.folio.isArchivable == true)
            this.folio.archive();
    }
});