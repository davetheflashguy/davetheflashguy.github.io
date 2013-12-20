var adobe = adobe ? adobe : {
	dps : {}
};

if(!adobe.dps) {
	adobe['dps'] = {};
}

adobe.dps.Store = function() {
	this.baseFolder = "./storeAPI/images/";
	this.authToken = "dd72fc0c-d772-48a4-ab85-ad2aa004ac1d";
	this.userName = "sunilbh";
	//this.authToken = "";
	//this.userName = "";
};

adobe.dps.Store.prototype.FolioState = {
	INVALID : 0,
	UNAVAILABLE : 50, /** The folio is not yet available for purchase */
	PURCHASABLE : 100, /** Can be purchased and downloaded */
	PURCHASING : 101, /** There is an active or paused Purchase Transaction for the
	 * folio */
	DOWNLOADABLE : 200, /** The folio is free, or its Purchase Transaction completed
	 * successfully */
	DOWNLOADING : 201, /** There is an active or paused Download Transaction for the
	 * folio */
	EXTRACTABLE : 400, /** The folio content is stored locally. */
	EXTRACTING : 401, /** There is an active or pause Extraction Transaction for the
	 * folio */
	VIEWABLE : 1000, /** The folio is can be loaded in the viewer */
	UPDATEDOWNLOADABLE : 1500, /** The folio is viewable but can be updated */
	UPDATEDOWNLOADING : 1501, /** There is an active update download for this folio
	 * */
	UPDATEEXTRACTABLE : 1502, /** The folio is viewable but has an update that can be
	 * installed */
	UPDATEEXTRACTING : 1503   /** There is an active update extraction for this folio
	 * */
};

/**
 * Get library state information for the folios in the library.
 *
 * @param callback:	Function to receive the list of folios.
 *		 each folio has these properties: id, productId, price, state, title,
 * description, broker, thirdPartyEntitled
 *		 id is the folio unique id
 *        productId is the store product identifier
 *		 price is a localized string representing the price of the folio
 *        state has the following values:
 *		     100, purchasable
 *		     >= 200 < 1000 entitlied, downloadable, installable.
 *		     >= 1000 viewable, update available.
 *        title is the title title extracted from the metadata
 *        description is the description extracted from the metadata
 *        broker is the authority that will entitle the folio (i.e. appleStore)
 *        thirdPartyEntitled indicates whether this folio is entitled by the
 * entitlement server, where applicable
 *		 NOTE: If no current or cached information is available, the function
 *		 will return an empty list
 */
adobe.dps.Store.prototype.getFolioData = function(callback) {
	var data = [
		{
			title : "First issue",
			description : "This is our first magazine.",
			productId : "0000054220130200000000",
			broker : "noChargeStore",
			thirdPartyEntitled : false,
			folioNumber : "1",
			publicationDate : 1332074877,
			targetDimensions : "1024x768,768x1024",
			id : "1",
			state : 200,
			price : "$64.99"
		},
		{
			title : "Second issue",
			description : "This is our second magazine.",
			productId : "0000054220080100000000",
			broker : "noChargeStore",
			thirdPartyEntitled : false,
			folioNumber : "1",
			publicationDate : 1332074877,
			targetDimensions : "1024x768,768x1024",
			id : "2",
			state : 200,
			price : "FREE"
		},
		{
			title : "Third issue",
			description : "This is our third magazine.",
			productId : "0000054220130200000000",
			broker : "noChargeStore",
			thirdPartyEntitled : false,
			folioNumber : "1",
			publicationDate : 1332074877,
			targetDimensions : "1024x768,768x1024",
			id : "3",
			state : 200,
			price : "FREE"
		},
		{
			title : "Fifth issue",
			description : "This is our fifth magazine.",
			productId : "0000054220130100000000",
			broker : "noChargeStore",
			thirdPartyEntitled : false,
			folioNumber : "1",
			publicationDate : 1332074877,
			targetDimensions : "1024x768,768x1024",
			id : "5",
			state : 1000,
			price : "FREE"
		}
	];
	callback(data);
};



/**
 * Get library state information for the subscriptions available in the library.
 *
 * @param callback:	Function to receive the list of subscriptions.
 *		 each subscription has these properties: productId, title, duration, price,
 * owned, active
 *		 where productId is the store product identifier
 *		 title is the formatted title of the subscription
 *		 duration is the formatted duration of the subscription (eg. 3 Months, 1 Week
 * etc)
 *		 price is a localized string representing the price of the folio
 *		 owned is a boolean signifying that this subscription has been owned by the
 * user
 *		 active is a boolean signifying that this subscription is currently active
 *		 NOTE: If no current or cached information is available, the function
 *		 will return an empty list
 */
adobe.dps.Store.prototype.getSubscriptionData = function(callback) {
	var data = [
		"2",
		"3",
		"5"
	];
	callback(data);
};
/**
 * Download or view the folio with the given product ID. If the folio is already
 * on the device
 * the viewer will open it for viewing otherwise the viewer will start the
 * download of the folio.
 * In either case the store web view will get closed immediately.
 * Notice that there is no callback for this function. If the view/download fails
 * the error
 * is handled by the viewer in whatever way is appropriate.
 * @param: folioProductId A string containing the product id of the folio to view
 * or download.
 */
adobe.dps.Store.prototype.viewFolio = function(folioProductId) {
	//console.log("ViewFolio:" + folioProductId);
	alert("ViewFolio:" + folioProductId);
};

/**
 * Purchase a folio with the given product ID.
 * @param: folioProductId A string containing the product id of the folio to buy.
 * @param: callback Function that will be called with this signature:
 *		  {"result":status} where status is one of "succeeded", "failed",
 * "cancelled", "refunded"
 * @param: withAnalytics An optional boolean indicating whether you want the
 * Viewer app to track analytics for this event.
 *         If you track analytics via JavaScript in your own store, pass in
 * false.
 *         Default value: true
 */
adobe.dps.Store.prototype.buyFolio = function(folioProductId, callback, withAnalytics) {
	var buy = confirm("Do you want to buy issue " + folioProductId + "?");
	var status = "failed";
	if(buy) {
		status = "succeeded";
	}
	var data = {
		result : status
	};
	callback(data);
};
/**
 * Archive a folio with the given product ID.
 * @param: folioProductId A string containing the product id of the folio to
 * archive.
 * @param: callback Function that will be called with this signature:
 *		  {"result":status} where status is one of "succeeded", "failed"
 */
adobe.dps.Store.prototype.archiveFolio = function(folioProductId, callback) {
	var archived = confirm("Do you want to archive issue " + folioProductId + "?");
	var status = "failed";
	if(archived) {
		status = "succeeded";
	}
	var data = {
		result : status
	};
	callback(data);
};
/**
 * Purchase a subscription with the given product ID.
 * @param: subscriptionProductId A string containing the product id of the
 * subscription to buy.
 * @param: callback Function that will be called with this signature:
 *		  {"result":status} where status is one of "succeeded", "failed",
 * "cancelled", "refunded", "notsupported"
 * @param: withAnalytics An optional boolean indicating whether you want the
 * Viewer app to track analytics for this event.
 *         If you track analytics via JavaScript in your own store, pass in
 * false.
 *         Default value: true
 */
adobe.dps.Store.prototype.buySubscription = function(subscriptionProductId, callback, withAnalytics) {
	var buy = confirm("Do you want to buy subscription " + subscriptionProductId + "?");
	var status = "failed";
	if(buy) {
		status = "succeeded";
	}
	var data = {
		result : status
	};
	callback(data);
};
/**
 * Get auth token and user name. Either value may be empty.
 * @param callback: Function that will be called with the user info:
 {"authToken":currentAuthToken, "userName": currentUsername}
 */
adobe.dps.Store.prototype.getUserInfo = function(callback) {
	var authToken = this.authToken;
	var userName = this.userName;
	var data = {
		"authToken" : 'dd72fc0c-d772-48a4-ab85-ad2aa004ac1d',
		"userName" : 'sunilbh'
		//"authToken" : '',
		//"userName" : ''
	};
	callback(data);
};
/**
 * Set the auth token and user name and let the viewer persist them.
 * Notice that there is no callback for this function invalid values for either
 * authToken or userName will make this function fail silently.
 * @param authToken: String containing the auth token or undefined in order to
 * sign out.
 * @param userName:	String containing the user name used to sign in or undefined
 * to clear the persisted user name.
 */
adobe.dps.Store.prototype.setUserInfo = function(authToken, userName) {
	this.authToken = authToken;
	this.userName = userName;
};
/**
 * Get a unique identifier string for the device the viewer is running on.
 * @param: callback Function that will be called with this signature:
 *		  deviceId where deviceId is the string containing the unique device ID
 */
adobe.dps.Store.prototype.getDeviceId = function(callback) {
	var data = "someDeviceId";
	callback(data);
};
/**
 * Initiate a refresh of entitlements in the viewer.
 * Notice that there is no callback for this function.
 * On error, will fail silently
 */
adobe.dps.Store.prototype.refreshEntitlements = function() {
	//console.log("refreshEntitlements");
	alert("refreshEntitlements");
};
/**
 * Initiate library update.
 * The response will not be sent through a callback function but through the
 * libraryUpdateComplete since a library update can be initiated by different
 * actions
 * and the interface should be notified when this happens.
 */

adobe.dps.Store.prototype.updateLibrary = function(handler) {
	//console.log("updateLibrary");
};

adobe.dps.Store.prototype.goToLibrary = function() {
	//console.log("goToLibrary");
};

/** Register the handler that will notify that a libraryUpdate has occurred. */
adobe.dps.Store.prototype.registerLibraryUpdateCompleteHandler = function(handler) {
	//console.log("registerLibraryUpdateCompleteHandler");
};

adobe.dps.Store.prototype.unregisterLibraryUpdateCompleteHandler = function() {
	//console.log("unregisterLibraryUpdateCompleteHandler");
};

/**
 * Request the path for a local preview image. the image will be downloaded if it
 * is not already cached.
 * @param productId A string containing the product id of the subscription to
 * buy.
 * @param portrait An boolean indicating whether you want a portrait or landscape
 * preview image
 * @param width The request width of the preview (Note: This property may be
 * ignored)
 * @param height The request height of the preview (Note: This property may be
 * ignored)
 * @param callback Function that will be called with this signature:
 *		  {"result":status, "path":path} where status is one of "succeeded", "failed"
 * and path is the path to the preview image
 */
adobe.dps.Store.prototype.getPreviewImage = function(folioProductId, portrait, width, height, callback) {
	var status = "failed";
	var path = "";
	switch(folioProductId) {
		case 'org.store.dummy.1':
		case 'org.store.dummy.2':
		case 'org.store.dummy.3':
		case 'org.store.dummy.4':
		case 'org.store.dummy.5':
			status = "succeeded";
			index = folioProductId.split(".")[3];
			if(portrait){
				path = this.baseFolder + "portrait" + index + ".jpeg";
			} else {
				path = this.baseFolder + "landscape" + index + ".jpeg";
			}
			break;
		default:
			break;
	}
	var data = {
		"result" : status,
		"path" : path
	};
	callback(data);
};
/**
 * Get receipts for all purchased folios and purchased subscriptions.
 *
 * @param:	callback Function that will be receive a dictionary of Store Product
 * Ids -> receipt pairs in the form of
 *			{productId:receipt}. The  folio product Ids can be retreived by the
 * getFolioData() call.  The receipts
 *			should be in the form the respective store server expects to receive. For
 * subscription receipts, we only
 *			pass the receipt associated with the subscription that was most recently
 * purchased.
 */
adobe.dps.Store.prototype.getReceiptData = function(callback) {
	var data = [];
	callback(data);
};
/**
 *	Returns the orientation registered by the Viewer since the orientation
 * provided
 *  by window.location does not work on all Android devices.
 *
 *  @param:	callback Function that will receive a JSON with the proper
 * orientation.
 */

adobe.dps.Store.prototype.getWindowOrientation = function(callback) {
	return window.location;
};
/**
 * Get list of product Ids that are entitled via third-party entitlements.
 *
 * @param:	callback Function that will be receive an array of Store Product Ids.
 */
adobe.dps.Store.prototype.getEntitledProducts = function(callback) {
	var data = [];
	callback(data);
};
/**
 * Display the custom subscription popup dialog
 */
adobe.dps.Store.prototype.presentCustomDialog = function() {};
/**
 * Dismiss the custom subscription popup dialog
 */
adobe.dps.Store.prototype.dismissCustomDialog = function() {};

// Create the actual store instance
adobe.dps.store = new adobe.dps.Store();

// Set the state variable denoting that the context is ready and call
// the user's event handler
window.adobedpscontextloaded = true;

if(window.onadobedpscontextloaded !== undefined) {
	window.onadobedpscontextloaded();
}