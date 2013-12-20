/*
	base.js - Serves as the BaseView for all views within the application.
*/
define(['jquery',
        'underscore',
        'backbone',
        'models/global','views/network_connection/main','storeAPI'], 
function($, _, Backbone, GlobalModel, NetworkConnectionView)
{
    var baseView = Backbone.View.extend(
    {
        globalModel           : new GlobalModel(),
        eventAggregator       : _.extend({}, Backbone.Events),

    	/*	
    		Method that loads our css file
    	   	and injects it into the current DOM 
			
			_files - Array of CSS files to load
			@return - DOM element to be injected into page
    	*/
    	loadCSS               : function(_files)
    	{
        var arr = [];
        for (var i = 0; i < _files.length; i++)
        {
          var link = document.createElement("link");
              link.type = "text/css";
              link.rel = "stylesheet";
              link.href = this.globalModel.getEnvironment() + "css/" + _files[i] + ".css";
              arr.push(link.href);

              document.getElementsByTagName("head")[0].appendChild(link);
              
        }
       
    	},
      /* Removes CDATA from a string and returns the contents */
      cleanDATA            : function(s)
      {
        var t = s.replace('<![CDATA[', '');
            t = t.replace(']]>', '');

          return t;
      }
    },
    getEventAggregatorReference = function()
    {
      var eventAggregator = _.extend({}, Backbone.Events);
      return eventAggregator;
    },
    /* Public helpers */
    /** 
      Helper that creates and binds our "smartButton"
        @ _state the actual state of the issue returned by DPS
        @ _button DOM instance of the button 
        @ _label DOM instance of the button label (optional to be different div)
        @ _accession_number accession number used to download the article in DFP
    */
    makeSmartButton = function(_state, _button, _label, _accession_number){
      var state               = _state;
      var button              = _button;
      var label               = _label;
      var accession_number    = _accession_number; 

      switch (state){
      /** 
        Invalid
        Button Treatment : Unavailable - Grey out buy button
      */
      case 0  :
        button.css("background-color", "#666666");
        label.html("Unavailable");
      break;

      /** 
        The folio is not yet available for purchase
        Button Treatment : Unavailable - Grey out buy button
      */
      case 50 :
        button.css("background-color", "#666666");
        label.html("Unavailable");
      break; 
                  
      /** 
        Can be purchased and downloaded
        Button Treatment : Buy Button - call download purchase
      */
      case 100 :
        button.click(function() {
          adobe.dps.store.buyFolio(accession_number);
          // buy folio gives you a call back once completed
          // once callback call viewFolio method.
        });
        label.html("Buy"); 
      break;  
                  
      /** 
        There is an active or paused Purchase Transaction for the folio
        Button Treatment : Unavailable - Grey out buy button
      */
      case 101 :
        button.css("background-color", "#666666");
        label.html("Unavailable");
      break;    

      /** 
        The folio is free, or its Purchase Transaction completed successfully
        Button Treatment : Download - call download/viewFolio method
      */
      case 200 :
        button.click(function() {
          adobe.dps.store.viewFolio(accession_number);
        });
        label.html("Download");
      break;

      /** 
        There is an active or paused Download Transaction for the folio
        Button Treatment : Downloading - Grey out buy button
      */
      case 201 :
        button.css("background-color", "#666666");
        label.html("Downloading");
      break;  

      /** 
        The folio content is stored locally
        Button Treatment : Read Issue - call viewFolio method
      */
      case 400 :
        button.click(function() {
          adobe.dps.store.viewFolio(accession_number);
        });
        label.html("View");
      break;  

      /** 
        There is an active or pause Extraction Transaction for the folio
        Button Treatment : Read Issue - call viewFolio method
      */
      case 401 :
        button.click(function() {
          adobe.dps.store.viewFolio(accession_number);
        });
        label.html("View");
      break;

      /** 
        The folio is can be loaded in the viewer 
        Button Treatment : Read Issue - call viewFolio method
      */
      case 1000 :
        button.click(function() {
          adobe.dps.store.viewFolio(accession_number);
        });
        label.text("View");
      break;   

      /** 
        The folio is viewable but can be updated 
        Update - and call download/viewFolio method
      */
      case 1500 :
        button.click(function() {
          adobe.dps.store.viewFolio(accession_number);
        });
        label.text("Update");
      break;                  
    }
  },   
  /**
    This method gets called when the network connection changes
  */
  promptNetworkChange = function(isConnected){
    if (isConnected == false){
      $('#container').append("<div id='network_dialog_container'></div>");
      this.networkConnectionView = new NetworkConnectionView();  
      this.networkConnectionView.setElement('#network_dialog_container').render(); 
    }else{
      $('#dialog').dialog('close');
      location.reload();
    }
  }, 
  /**
    Truncates strings by extending native string class in JS 
  */
  String.prototype.truncate = function() {
    var re = this.match(/^.{0,125}[\S]*/);
    var l = re[0].length;
    var re = re[0].replace(/\s$/,'');
    if(l < this.length)
      re = re + "&hellip;";
        
    return re;
  });
  return baseView;
});