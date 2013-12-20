/**
 * WKIPAD bootstrap
 * This file will load all the application files
 */

// scripts we need to load
var scripts = [ 'fastclick.js', 
				'jquery.transit.min.js', 
				'jquery.unveil.min.js', 
				'hammer.min.js', 
				'underscore-min.js', 
				'json2.js', 
				'backbone-min.js', 
				'config.js', 
				'Library.js', 
				'LibraryDetail.js', 
				'Login.js', 
				'LargeLibraryItemView.js', 
				'CoverImage.js', 
				'TopLibraryItemView.js', 
				'BottomLibraryItemView.js', 
				'SubLibraryItem.js', 
				'SubLibraryDetailItem.js', 
				'RemoveFolios.js', 
				'RemoveFolioItem.js', 
				'Router.js'
			   ];
// core app
var app = "app.js";
// array positioner
var loaderPosition = 0;
// domain
var domain = "http://wkipad.azurewebsites.net";
// app name
var appName = "AAN-Family-App";
// local isLocal variable (gets passed into loadApp from main.js)
var isLocal;
// your local development path
var localPath = "http://localhost/WoltersKluwer/AAN-Family-App/";
// handles loading scripts needed for the application
function loadApp(_isLocal){
	isLocal = _isLocal;
	loadStyle("core.css");
	loadScript(scripts[0], getNextScript);	
}

// loads the javascripts used within this application
function loadScript(url, callback){
	var script = document.createElement("script")
    	script.type = "text/javascript";
		script.onload = function(){
			if (callback) {
				callback();	
			}
    	};
	
	// for local development
	if(isLocal == true){
		// your physical path here
		script.src = localPath + url;
	}else {
		script.src = domain + "/" + appName + "/" + url;
	}  
	
	// injects the javascript include into the head of the page
	document.getElementsByTagName("head")[0].appendChild(script);
}

// loads the application CSS file(s)
function loadStyle(url) {
	var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";

    // for local development
    if(isLocal == true){
    	// your physical path here
		link.href = localPath + url;
	}else {
		link.href = domain + "/" + appName + "/" + url + "?c="+Math.random() * 999999;
	}

	// injects the css include into the head of the page
    document.getElementsByTagName("head")[0].appendChild(link);
}

// handles what files to load and eventually kicks off app once we are done loading
function getNextScript(){
	loaderPosition ++;
	if (loaderPosition < scripts.length) {
		loadScript(scripts[loaderPosition], getNextScript);
	}else{
		$("body").append(getApplicationShellHTML());
		var script = document.createElement("script")
    		script.type = "text/javascript";
			script.onload = function(){
		    	// Finally, we kick things off by creating the **App**.
		    	var App = new AppView;
		     	// Initiate the router 	
		    	var router = new AppRouter();
		    	Backbone.history.start();
			};
		
		// for development
		if (isLocal == true) {
			// your physical path here
			script.src = localPath + app;
		}else {
			script.src = domain + "/" + appName + "/" + app;
		}
		
			// injects the APP include into the head of the page
		document.getElementsByTagName("head")[0].appendChild(script);
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