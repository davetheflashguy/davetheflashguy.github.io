/**
 * The main file to start the store.
 * A very basic store that laysout the folios in a grid.
 */
$(document).ready(function() {
	window.onerror = function(msg, url, line) {
   	   	$("body").html("Error: " + msg + "\nurl: " + url + "\nline #: " + line);
	};
	// core app
	var app = "app.js";
	// array positioner
	var loaderPosition = 0;
	// domain
	var domain = "http://wkipad.azurewebsites.net";
	// app name
	var appName = "aan-family";
	// isLocal
	var isLocal = false;
	// installed folios (offline mode)
	var installedFolios = [];
	// installed folio images (offline mode)
	var installedFolioCovers = [];
	
	// initializer
	function init() {
		// check navigator online status
		var status = navigator.onLine;

		// first check if we have online status
		if (status == true) {
			injectMetaData();
			// load bootstrap
			var script = document.createElement("script")
		    	script.type = "text/javascript";
				script.onload = function(){
					// we are loaded
					loadApp(isLocal);
		    	};
			
			// for local development
			if(isLocal == true){
				// your physical path here
				script.src = "http://localhost/LWWMobile/FamilyApp/library-dev/bootstrap.js";
			}else {
				script.src = domain + "/" + appName + "/" + 'bootstrap.js';
			}  
			
			// injects the javascript include into the head of the page
			document.getElementsByTagName("head")[0].appendChild(script);
		} else {
			// user is offline, goOffline handles next steps
			goOffline();
		}

		// add listeners for network change
		window.addEventListener('online', onNetworkStatusChange);
		window.addEventListener('offline', onNetworkStatusChange);
	}

	// handles calling our set or create meta data function
	function injectMetaData() {
		// tells apple it's a apple web app
		setOrCreateMetaTag('name', 'apple-mobile-web-app-capable', 'yes');
		// doesn't try and map numbers to phone numbers
		setOrCreateMetaTag('name', 'format-detection', 'telephone=no');
		// locks the view port, no scaling.
		setOrCreateMetaTag('name', 'viewport', 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0');	
	}

	// when network connectivity changes we want to reset the app
	function resetApp() {
		loaderPosition = 0;
		//$("body").html("");
		loadApp();
	}

	// called when user goes offline
	function goOffline() {
		// check to see if we have any folios
		var list = getFolios();
		if (list.length == 0) {
			alert("Error:  please check internet connection, you currently don't have any installed folios to view.")
		} else {
			displayFolios();
		}
	}

	// gets the folio listing from DPS when we are offline
	function getFolios(){
		// call to SDK
        var folios = [];
        // Sort the folios descending order based on publication date
        var list = adobeDPS.libraryService.folioMap.sort(function (a, b) {
    	if (a.publicationDate < b.publicationDate)
        	return 1;
        else if (a.publicationDate > b.publicationDate)
            return -1;
        else
           return 0;
        });
        
        // store installed folios in an array
        for (var i in list) {
        	if (list[i]["state"] == adobeDPS.libraryService.folioStates.INSTALLED) {
        		var folio = list[i];
            	installedFolios.push(folio);
        	}
        }

        return installedFolios;
        
	}

	// displays installed folios in a grid
	function displayFolios() {
		var el = document.getElementById("main-wrapper");
			el.innerHTML = getApplicationOfflineShellHTML();	

		var el = document.getElementById("section-offline");
        if (installedFolios.length > 0) {
        	
        	el.innerHTML = "<ul></ul>";
        	var folio;
        	for (var i=0; i < installedFolios.length; i++) {
        		var html = "";
        			html += "<li>";
    		 		html += "<div class=\"offline-folio-item\">";
    			folio = adobeDPS.libraryService.folioMap.internal[installedFolios[i].id];
    			var previewImageTransaction = folio.getPreviewImage(220, 295, true);
                	previewImageTransaction.completedSignal.addOnce(getPreviewImageHandler, this);
                	// map the div id to the preview image transaction id
                	html += "<div id='"+previewImageTransaction.id+"' class=\"offline-folio-image-container\" data-folio-id='"+folio.id+"'>";
    				html += "</div>";	
		        	html += "<div class=\"offline-folio-title\">"
		        	html += installedFolios[i].title;
		        	html += "</div>";
		        	html += "<div class=\"offline-folio-citation\">";
		        	html += installedFolios[i].folioNumber;
		        	html += "</div>";
		       		html += "</div>";
		    		html += "</li>";    
		    	// add li
		    	$("ul").append(html);
		    	// add listener, again mapping the preview image id to the div id
		    	$("#"+previewImageTransaction.id).click(function(){
		    		// open the installed folio
		    		folio.view();
		    	})
			}
        }
	}

	// cover image loader
	function getPreviewImageHandler(transaction) {
        if (transaction.state == adobeDPS.transactionManager.transactionStates.FINISHED && transaction.previewImageURL != null) {
            $("#"+transaction.id).html("<img src='" + transaction.previewImageURL + "' width='220' />");     
        } 
    }

	// returns base online shell
	function getApplicationShellHTML() {
		var html = "<div id=\"main-wrapper\" class=\"wrapper main\" data-page-id=\"\">";
			html += "</div>";
		return html;
	}

	// returns offline shell
	function getApplicationOfflineShellHTML() {
		var root = document.getElementById('main-wrapper');
            root.setAttribute('data-page-id','offline');
			var html = "";
			// header
			html += "<header class=\"header offline\" id=\"offline-header\">";
			html += "American Academy of Neurology Publications";
			html += "</header>";
			// custom instructions
			html += "<div id=\"offline-message\">";
            html += "Application is in offline mode.  Please check network connectivity.";
            html += "</div>";
            // grid of folios
            html += "<div id=\"section-offline\">";
            html += "</div>";

		return html;
	}

	// sets or injects meta data tags into the document
	function setOrCreateMetaTag(metaName, name, value) {
    	var t = 'meta['+metaName+'='+name+']';
    	var mt = $(t);
    	if (mt.length === 0) {
        	t = '<meta '+metaName+'="'+name+'" />';
        	mt = $(t).appendTo('head');
    	}
    	mt.attr('content', value);
	}

	// fired when there is a change in network status
	function onNetworkStatusChange(event) {
		if (navigator.onLine == true) {
			resetApp();
		}else {
			goOffline();
		}
	}

	// force the init for local development
    if (isLocal == true) {
    	// force the init
    	init();
    }else {
    	// listen for the DPS init listener then start things off
		adobeDPS.initializationComplete.addOnce(init);
    }

});